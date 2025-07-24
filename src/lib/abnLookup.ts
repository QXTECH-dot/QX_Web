import axios from 'axios';
import { firestore } from '@/lib/firebase/admin';
import { v4 as uuidv4 } from 'uuid';

// ABN Lookup API GUID
const ABN_LOOKUP_GUID = "253136de-6266-47f6-a28d-b729867f4b1c";
const ABN_LOOKUP_BASE_URL = "https://abr.business.gov.au/json";

// 格式化公司名称为首字母大写格式
function formatCompanyName(name: string): string {
  if (!name) return name;
  
  return name
    .toLowerCase() // 先转为全小写
    .split(' ') // 按空格分割单词
    .map(word => {
      // 处理特殊字符（如连字符、点号等）
      return word.split(/([^a-zA-Z0-9])/).map(part => {
        if (part.length > 0 && /[a-zA-Z]/.test(part[0])) {
          // 如果是字母开头，首字母大写
          return part.charAt(0).toUpperCase() + part.slice(1);
        }
        return part;
      }).join('');
    })
    .join(' ') // 重新拼接
    .trim();
}

// 超时配置（Vercel优化版）
const API_TIMEOUT = 8000; // 降回8秒，适应Vercel环境
const BATCH_SIZE = 6; // 适中的并发数量
const MAX_RESULTS = 30; // 恢复合理的限制，确保Vercel环境下不超时

/**
 * 生成下一个COMP_XXXXX编号（使用Admin SDK）
 */
async function generateNextCompanyIdAdmin(): Promise<string> {
  try {
    const companiesSnapshot = await firestore.collection('companies').get();
    let maxNumber = 0;
    
    companiesSnapshot.docs.forEach(doc => {
      const companyId = doc.id;
      // 检查是否符合 COMP_XXXXX 格式（5位数字）
      const match = companyId.match(/^COMP_(\d{5})$/);
      if (match) {
        const number = parseInt(match[1], 10);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    
    // 生成新的编号
    const nextNumber = maxNumber + 1;
    return `COMP_${String(nextNumber).padStart(5, '0')}`;
  } catch (error) {
    console.error('[ABN Lookup] Error generating company ID:', error);
    // 如果生成失败，使用时间戳作为备用方案，但保持COMP_格式
    const timestamp = Date.now();
    const shortId = timestamp.toString().slice(-5); // 取最后5位
    return `COMP_${shortId}`;
  }
}

/**
 * 生成URL slug（Admin SDK版本）
 */
function generateSlugAdmin(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // 移除特殊字符，只保留字母、数字、空格和横杠
    .replace(/\s+/g, '-') // 将空格替换为横杠
    .replace(/-+/g, '-') // 将多个连续横杠替换为一个
    .replace(/^-|-$/g, '') // 移除开头和结尾的横杠
    .trim();
}

/**
 * 检查slug是否唯一（Admin SDK版本）
 */
async function isSlugUniqueAdmin(slug: string, excludeCompanyId?: string): Promise<boolean> {
  try {
    const querySnapshot = await firestore.collection('companies').where('slug', '==', slug).get();
    
    if (querySnapshot.empty) {
      return true;
    }
    
    // 如果提供了excludeCompanyId，检查是否是同一个公司（用于更新时）
    if (excludeCompanyId) {
      const docs = querySnapshot.docs;
      return docs.length === 1 && docs[0].id === excludeCompanyId;
    }
    
    return false;
  } catch (error) {
    console.error('[ABN Lookup] Error checking slug uniqueness:', error);
    return false;
  }
}

/**
 * 生成唯一slug（Admin SDK版本）
 */
async function generateUniqueSlugAdmin(name: string, excludeCompanyId?: string): Promise<string> {
  let baseSlug = generateSlugAdmin(name);
  let slug = baseSlug;
  let counter = 1;
  
  while (!(await isSlugUniqueAdmin(slug, excludeCompanyId))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * 优化版本：从ABN Lookup API获取公司信息（带超时控制）
 */
export async function getCompanyByAbn(abn: string) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('ABN API timeout')), API_TIMEOUT);
  });

  try {
    console.log(`[ABN Lookup] Searching for ABN: ${abn}`);

    // 清理ABN
    const cleanAbn = abn.replace(/[^0-9]/g, '');
    if (cleanAbn.length !== 11) {
      console.error(`[ABN Lookup] Invalid ABN format: ${abn}`);
      return null;
    }

    // 构建API请求
    const url = `${ABN_LOOKUP_BASE_URL}/AbnDetails.aspx`;
    const params = { abn: cleanAbn, guid: ABN_LOOKUP_GUID };

    // 发送请求（带超时控制）
    const response = await Promise.race([
      axios.get(url, { 
        params, 
        timeout: API_TIMEOUT - 1000 // axios自身超时比Promise race稍短
      }),
      timeoutPromise
    ]) as any;
    
    // 解析JSONP响应
    const responseText = response.data;
    const jsonRegex = /callback\((.*)\)/;
    const match = jsonRegex.exec(responseText);
    
    if (!match || !match[1]) {
      console.error(`[ABN Lookup] Failed to parse JSONP response`);
      return null;
    }
    
    const jsonData = JSON.parse(match[1]);
    
    // 检查错误和有效性
    if (jsonData?.Message || !jsonData?.Abn || jsonData.AbnStatus !== 'Active') {
      console.log(`[ABN Lookup] Invalid or inactive ABN: ${abn}`);
      return null;
    }
    
    console.log(`[ABN Lookup] Found company: ${jsonData.EntityName}`);
    return jsonData;
  } catch (error) {
    console.error(`[ABN Lookup] Error for ABN ${abn}:`, error);
    return null;
  }
}

/**
 * 优化版本：按公司名搜索（限制结果数量和处理时间）
 */
export async function getCompaniesByName(name: string) {
  const startTime = Date.now();
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Name search timeout')), API_TIMEOUT);
  });

  try {
    console.log(`[ABN Lookup] Searching for companies with name: "${name}"`);

    if (!name?.trim()) {
      return [];
    }

    const searchTerm = name.trim();
    const url = `${ABN_LOOKUP_BASE_URL}/MatchingNames.aspx`;
    const params = {
      name: searchTerm,
      guid: ABN_LOOKUP_GUID,
      maxResults: 100, // 降低到100，在结果丰富度和处理速度间平衡
      minimumScore: 15 // 稍微提高分数阈值，获取更相关的结果
    };

    // 发送请求（带超时控制）
    const response = await Promise.race([
      axios.get(url, { 
        params, 
        timeout: API_TIMEOUT - 1000
      }),
      timeoutPromise
    ]) as any;

    // 解析响应
    const responseText = response.data;
    const jsonRegex = /callback\((.*)\)/;
    const match = jsonRegex.exec(responseText);
    
    if (!match || !match[1]) {
      console.error(`[ABN Lookup] Failed to parse name search response`);
      return [];
    }
    
    const jsonData = JSON.parse(match[1]);
    
    if (!jsonData?.Names || !Array.isArray(jsonData.Names)) {
      console.log(`[ABN Lookup] No companies found with name: "${name}"`);
      return [];
    }
    
    // 直接使用ABN API返回的所有公司，不进行名称匹配过滤
    console.log(`[ABN Lookup] ===== ABN API Raw Response Debug =====`);
    console.log(`[ABN Lookup] Search term: "${searchTerm}"`);
    console.log(`[ABN Lookup] API URL: ${url}`);
    console.log(`[ABN Lookup] API Params:`, params);
    console.log(`[ABN Lookup] Total companies from API: ${jsonData.Names.length}`);
    console.log(`[ABN Lookup] ALL companies from API:`, jsonData.Names.map((c: any, index: number) => ({
      index: index + 1,
      Name: c.Name,
      Score: c.Score,
      Abn: c.Abn
    })));
    console.log(`[ABN Lookup] ===== End Raw Response Debug =====`);

    // 智能筛选：确保公司名包含搜索关键词（改进版）
    const allCompanies = jsonData.Names
      .filter((company: any) => {
        if (!company.Abn) return false; // 必须有ABN
        
        // 实现智能名称匹配 - 公司名必须包含搜索关键词
        const companyName = (company.Name || '').toLowerCase().trim();
        const searchTermLower = searchTerm.toLowerCase().trim();
        
        // 如果公司名包含搜索词，直接通过
        if (companyName.includes(searchTermLower)) {
          console.log(`[ABN Lookup] ✅ MATCHED (contains): "${company.Name}" contains "${searchTerm}"`);
          return true;
        }
        
        // 分词匹配：检查搜索词的每个单词是否都在公司名中
        const searchWords = searchTermLower.split(/\s+/).filter(word => word.length > 0);
        const companyWords = companyName.split(/\s+/).filter(word => word.length > 0);
        
        // 所有搜索词都必须在公司名中找到匹配
        const allWordsMatched = searchWords.every(searchWord => 
          companyWords.some(companyWord => 
            companyWord.includes(searchWord) || searchWord.includes(companyWord)
          )
        );
        
        if (allWordsMatched) {
          console.log(`[ABN Lookup] ✅ MATCHED (word-match): "${company.Name}" matches all words in "${searchTerm}"`);
          return true;
        }
        
        // 如果都不匹配，拒绝
        console.log(`[ABN Lookup] ❌ REJECTED: "${company.Name}" does not contain "${searchTerm}"`);
        return false;
      })
      .sort((a: any, b: any) => (b.Score || 0) - (a.Score || 0));
      // 移除数量限制，处理所有结果

    console.log(`[ABN Lookup] Processing all ${allCompanies.length} companies from ABN API (no limits)`);

    // 并发获取详细信息（限制并发数）
    const companiesWithDetails = [];
    for (let i = 0; i < allCompanies.length; i += BATCH_SIZE) {
      // 检查是否已经处理太久，如果是就提前返回
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > API_TIMEOUT * 0.8) { // 80%时间就停止
        console.log(`[ABN Lookup] Time limit approaching, stopping at ${companiesWithDetails.length} companies`);
        break;
      }
      
      const batch = allCompanies.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (company: any) => {
        if (!company.Abn) return null;
        
        try {
          const details = await getCompanyByAbn(company.Abn);
          if (!details) return null;
          
          // 只过滤inactive和sole trader，其他全部保留
          if (details.AbnStatus !== 'Active') {
            console.log(`[ABN Lookup] Filtering out inactive company: "${details.EntityName}"`);
            return null;
          }
          
          // 过滤掉sole trader (个人经营者)
          if (details.EntityTypeCode === 'IND') {
            console.log(`[ABN Lookup] Filtering out sole trader: "${details.EntityName}"`);
            return null;
          }
          
          console.log(`[ABN Lookup] Accepting company: "${details.EntityName}" (${details.EntityTypeCode})`);
          
          return {
            ...details,
            Score: company.Score,
            MatchedName: company.Name
          };
        } catch (error) {
          console.error(`[ABN Lookup] Error for company:`, error);
          return null;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      companiesWithDetails.push(...batchResults.filter(Boolean));
    }
    
    console.log(`[ABN Lookup] Retrieved ${companiesWithDetails.length} companies with details`);
    return companiesWithDetails;
  } catch (error) {
    console.error(`[ABN Lookup] Error searching by name "${name}":`, error);
    return [];
  }
}

/**
 * 获取特定州/地区的下一个序号
 * @param companyId 公司ID
 * @param stateCode 州/地区代码
 * @returns 格式化的序号字符串（如"01"、"02"等）
 */
async function getNextOfficeNumberForState(companyId: string, stateCode: string): Promise<string> {
  try {
    // 获取该公司在特定州/地区的所有办公室
    const officesSnapshot = await firestore.collection('offices')
      .where('companyId', '==', companyId)
      .get();
    
    // 找出该州/地区的办公室序号模式
    const stateOfficePattern = new RegExp(`^${companyId}_${stateCode}_(\\d{2})$`);
    const stateOfficeNumbers: number[] = [];
    
    officesSnapshot.forEach(doc => {
      const officeId = doc.id;
      const match = officeId.match(stateOfficePattern);
      if (match && match[1]) {
        stateOfficeNumbers.push(parseInt(match[1], 10));
      }
    });
    
    // 如果没有找到匹配的序号，从01开始
    if (stateOfficeNumbers.length === 0) {
      return '01';
    }
    
    // 找出最大序号并加1
    const maxNumber = Math.max(...stateOfficeNumbers);
    return (maxNumber + 1).toString().padStart(2, '0');
  } catch (error) {
    console.error(`[ABN Lookup] Error getting next office number: ${error}`);
    // 出错时默认返回01
    return '01';
  }
}

/**
 * 优化版本：保存公司到数据库（简化版）
 */
export async function saveCompanyFromAbnLookup(abnData: any) {
  try {
    console.log(`[ABN Lookup] 尝试保存公司: ${abnData.EntityName}`);
    
    const cleanAbn = abnData.Abn.replace(/[^0-9]/g, '');
    
    // 🛡️ 强制数据保护检查 - 绝对不覆盖现有数据
    console.log(`[ABN Lookup] 🔍 执行强制数据保护检查 - ABN: ${cleanAbn}`);
    const existingCompany = await findCompanyByAbn(cleanAbn);
    
    // 处理错误情况：如果查找出错，为安全起见拒绝创建
    if (existingCompany && existingCompany.error) {
      console.log(`[ABN Lookup] 🚨 查找现有公司时出错，为保护数据安全拒绝创建新记录`);
      console.log(`[ABN Lookup] ❌ 错误信息: ${existingCompany.message}`);
      return null; // 拒绝创建新记录
    }
    
    if (existingCompany) {
      console.log(`[ABN Lookup] 🛡️ 数据保护生效！发现现有公司，完全跳过录入`);
      console.log(`[ABN Lookup] 📋 现有公司信息: ID=${existingCompany.id}, Name=${existingCompany.name || existingCompany.name_en}`);
      console.log(`[ABN Lookup] 🚫 拒绝创建新记录 - 以数据库现有数据为准`);
      console.log(`[ABN Lookup] ✅ 返回现有公司数据，确保不被覆盖`);
      
      // 绝对不创建、不修改、不覆盖 - 直接返回现有数据
      return { 
        ...existingCompany, 
        _isFromAbnLookup: true,
        _dataProtected: true,  // 添加标记表示数据被保护
        _message: `现有公司数据已保护，未执行ABN录入`
      };
    }
    
    console.log(`[ABN Lookup] ✅ 确认为全新公司（ABN不存在于数据库），可以安全创建`);
    console.log(`[ABN Lookup] 🆕 开始创建新公司记录...`);  

    // 生成标准格式的公司ID
    const companyId = await generateNextCompanyIdAdmin();

    // 格式化公司名称
    const formattedCompanyName = formatCompanyName(abnData.EntityName);
    const formattedTradingName = abnData.TradingName ? formatCompanyName(abnData.TradingName) : undefined;
    
    // 生成唯一slug（优先使用trading name，如果没有则使用公司名）
    const nameForSlug = formattedTradingName || formattedCompanyName;
    const slug = await generateUniqueSlugAdmin(nameForSlug);

    // 公司数据（与admin创建的格式保持一致）
    const companyData = {
      companyId: companyId, // 添加companyId字段
      name: formattedCompanyName,
      name_en: formattedCompanyName,
      trading_name: formattedTradingName || '',
      abn: cleanAbn,
      logo: '',
      shortDescription: `${formattedCompanyName} is a registered business in Australia.`,
      fullDescription: `${formattedCompanyName} is a registered business in Australia with ABN: ${cleanAbn}.`,
      foundedYear: abnData.AbnStatusEffectiveFrom ? 
                  new Date(abnData.AbnStatusEffectiveFrom).getFullYear().toString() : 
                  new Date().getFullYear().toString(),
      industry: '',
      industry_1: '',
      industry_2: '',
      industry_3: '',
      state: abnData.AddressState || '',
      website: '',
      email: '',
      phone: '',
      size: '',
      languages: ['English'],
      slug: slug,
      source: 'ABN_LOOKUP_API'
    };
    
    // 🔒 最终安全检查 - 在保存前再次确认ABN不存在
    console.log(`[ABN Lookup] 🔒 执行最终安全检查，确保不会覆盖数据...`);
    const finalCheck = await findCompanyByAbn(cleanAbn);
    
    // 处理最终检查的错误情况
    if (finalCheck && finalCheck.error) {
      console.log(`[ABN Lookup] 🚨 最终检查时出错，为保护数据拒绝创建`);
      return null;
    }
    
    if (finalCheck) {
      console.log(`[ABN Lookup] 🚨 最终检查发现现有公司！取消创建操作`);
      console.log(`[ABN Lookup] 🛡️ 数据保护生效 - 返回现有公司: ${finalCheck.id}`);
      return { 
        ...finalCheck, 
        _isFromAbnLookup: true,
        _dataProtected: true,
        _message: `最终检查阻止了数据覆盖`
      };
    }
    
    // 保存新公司数据 - 此时已经三重确认不存在相同ABN的公司
    console.log(`[ABN Lookup] 🆕 最终确认：安全创建新公司 ${companyId}`);
    await firestore.collection('companies').doc(companyId).set(companyData);
    console.log(`[ABN Lookup] ✅ 成功创建全新公司: ${companyId} - ${formattedCompanyName}`);
    
    // 如果有地址信息，创建办公室
    let createdOffice = null;
      if (abnData.AddressState) {
      const officeId = `${companyId}_${abnData.AddressState}_01`;
      const officeData = {
        companyId: companyId,
        name: formattedCompanyName,
        state: abnData.AddressState,
        city: '',
        address: abnData.AddressPostcode ? `Postcode: ${abnData.AddressPostcode}` : '',
        postalCode: abnData.AddressPostcode || '',
        country: 'Australia',
        isHeadquarter: true,
        createdAt: new Date().toISOString(),
        source: 'ABN_LOOKUP_API'
      };
      
        await firestore.collection('offices').doc(officeId).set(officeData);
      console.log(`[ABN Lookup] Created office: ${officeId}`);

      createdOffice = { id: officeId, ...officeData };
    }

    // 🔧 详细调试：显示格式化前后的公司数据
    console.log(`[ABN Lookup] 公司名称格式化:`, {
      original_EntityName: abnData.EntityName,
      formatted_name_en: formattedCompanyName,
      original_TradingName: abnData.TradingName,
      formatted_trading_name: formattedTradingName,
      companyId: companyId,
      abn: companyData.abn,
      state: companyData.state
    });

    return {
      id: companyId,
      ...companyData,
      offices: createdOffice ? [createdOffice] : [],
      _isFromAbnLookup: true
    };
  } catch (error) {
    console.error('[ABN Lookup] Error saving company:', error);
    return null;
  }
}

/**
 * 查找现有公司 - 超强防护版，绝对防止覆盖现有数据
 */
async function findCompanyByAbn(abn: string) {
  try {
    console.log(`[ABN Lookup] 🔍 强化检查ABN是否已存在: ${abn}`);
    
    // 多重检查策略：确保绝对不会遗漏现有公司
    
    // 1. 按完整ABN查找
    const exactAbnSnapshot = await firestore.collection('companies')
      .where('abn', '==', abn)
      .get(); // 使用get()而不是limit()，确保找到所有匹配项
    
    if (!exactAbnSnapshot.empty) {
      console.log(`[ABN Lookup] 🛡️ 发现 ${exactAbnSnapshot.docs.length} 个现有公司（完全匹配ABN）`);
      
      // 返回第一个匹配的公司，但记录所有匹配项
      const doc = exactAbnSnapshot.docs[0];
      const data = doc.data();
      
      console.log(`[ABN Lookup] 📋 现有公司完整信息:`, {
        id: doc.id,
        name: data.name,
        name_en: data.name_en, 
        trading_name: data.trading_name,
        website: data.website,
        phone: data.phone,
        email: data.email,
        logo: data.logo ? '✅有logo' : '❌无logo',
        description: data.description ? '✅有描述' : '❌无描述',
        industry_1: data.industry_1,
        foundedYear: data.foundedYear,
        source: data.source,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
      
      // 如果发现多个匹配项，记录警告
      if (exactAbnSnapshot.docs.length > 1) {
        console.log(`[ABN Lookup] ⚠️ 警告：发现${exactAbnSnapshot.docs.length}个相同ABN的公司`);
        exactAbnSnapshot.docs.forEach((doc, index) => {
          console.log(`[ABN Lookup] 重复公司 ${index + 1}: ${doc.id} - ${doc.data().name || doc.data().name_en}`);
        });
      }

      // 获取办公室信息
      const officesSnapshot = await firestore.collection('offices')
        .where('companyId', '==', doc.id)
        .get();
        
      const offices = officesSnapshot.docs.map(officeDoc => ({
        id: officeDoc.id,
        ...officeDoc.data()
      }));
        
      console.log(`[ABN Lookup] 🔒 数据保护激活 - 现有公司将被保护，不会被覆盖`);
      
      return {
        id: doc.id,
        ...data,
        offices
      };
    }
    
    // 2. 额外检查：按去除空格的ABN查找（防止格式问题）
    const cleanAbnVariants = [
      abn.replace(/\s/g, ''),  // 去除空格
      abn.replace(/[^0-9]/g, ''), // 只保留数字
    ];
    
    for (const variant of cleanAbnVariants) {
      if (variant !== abn && variant.length === 11) {
        const variantSnapshot = await firestore.collection('companies')
          .where('abn', '==', variant)
          .limit(1)
          .get();
          
        if (!variantSnapshot.empty) {
          const doc = variantSnapshot.docs[0];
          console.log(`[ABN Lookup] 🛡️ 通过ABN变体找到现有公司: ${doc.id} (原ABN: ${abn}, 匹配变体: ${variant})`);
          
          const data = doc.data();
          const officesSnapshot = await firestore.collection('offices')
            .where('companyId', '==', doc.id)
            .get();
            
          const offices = officesSnapshot.docs.map(officeDoc => ({
            id: officeDoc.id,
            ...officeDoc.data()
          }));
          
          return {
            id: doc.id,
            ...data,
            offices
          };
        }
      }
    }
    
    console.log(`[ABN Lookup] ✅ 确认：ABN ${abn} 在数据库中完全不存在，可以安全创建新记录`);
    return null;
  } catch (error) {
    console.error(`[ABN Lookup] 查找现有公司时出错:`, error);
    // 出错时为了安全起见，假设公司可能存在，拒绝创建
    console.log(`[ABN Lookup] 🚨 查找出错，为安全起见拒绝创建新公司`);
    return { error: true, message: '查找现有公司时出错，为保护数据拒绝创建' };
  }
}

/**
 * 简单映射业务类型到行业类别
 * @param businessType ABN Lookup API返回的业务类型
 * @returns 映射的行业类别
 */
function mapBusinessType(businessType: string): string {
  // 返回空字符串，不再自动映射行业
  return '';
} 