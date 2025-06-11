import axios from 'axios';
import { firestore } from '@/lib/firebase/admin';
import { v4 as uuidv4 } from 'uuid';

// ABN Lookup API GUID
const ABN_LOOKUP_GUID = "253136de-6266-47f6-a28d-b729867f4b1c";
const ABN_LOOKUP_BASE_URL = "https://abr.business.gov.au/json";

// 超时配置（优化后）
const API_TIMEOUT = 8000; // 8秒超时
const BATCH_SIZE = 3; // 并发处理数量限制
const MAX_RESULTS = 15; // 增加最大处理结果数，展示更多ABN lookup的公司

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
      maxResults: 50, // 增加结果数，获取更多ABN lookup的结果
      minimumScore: 20 // 降低分数阈值，不过滤太多结果
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
    console.log(`[ABN Lookup] Total companies from API: ${jsonData.Names.length}`);
    console.log(`[ABN Lookup] First 3 companies from API:`, jsonData.Names.slice(0, 3).map((c: any) => ({
      Name: c.Name,
      Score: c.Score,
      Abn: c.Abn
    })));

    // 取所有返回的公司，按分数排序，限制处理数量
    const allCompanies = jsonData.Names
      .filter((company: any) => company.Abn) // 只需要确保有ABN
      .sort((a: any, b: any) => (b.Score || 0) - (a.Score || 0))
      .slice(0, MAX_RESULTS); // 限制处理数量

    console.log(`[ABN Lookup] Processing ${allCompanies.length} companies from ABN API`);

    // 并发获取详细信息（限制并发数）
    const companiesWithDetails = [];
    for (let i = 0; i < allCompanies.length; i += BATCH_SIZE) {
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
          console.error(`[ABN Lookup] Error getting details for ${company.Abn}:`, error);
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
    console.log(`[ABN Lookup] Saving company: ${abnData.EntityName}`);
    
    const cleanAbn = abnData.Abn.replace(/[^0-9]/g, '');
    
    // 检查是否已存在
    const existingCompany = await findCompanyByAbn(cleanAbn);
    if (existingCompany) {
      console.log(`[ABN Lookup] Company exists: ${existingCompany.id}`);
      return { ...existingCompany, _isFromAbnLookup: true };
    }

    // 生成新的公司ID（简化版）
    const timestamp = Date.now();
    const companyId = `COMP_${timestamp}`;

    // 公司数据
    const companyData = {
      abn: cleanAbn,
      name_en: abnData.EntityName,
      description: `${abnData.EntityName} is a registered business in Australia with ABN: ${cleanAbn}.`,
      shortDescription: `${abnData.EntityName} is a registered business in Australia.`,
      location: abnData.AddressState || 'Australia',
      website: '',
      industry: '',
      teamSize: '',
      services: [],
      languages: ['English'],
      rating: 0,
      foundedYear: abnData.AbnStatusEffectiveFrom ? 
                  new Date(abnData.AbnStatusEffectiveFrom).getFullYear().toString() : 
                  new Date().getFullYear().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'ABN_LOOKUP_API'
    };

    // 保存公司数据
    await firestore.collection('companies').doc(companyId).set(companyData);
    console.log(`[ABN Lookup] Created company: ${companyId}`);

    // 如果有地址信息，创建办公室
    let createdOffice = null;
    if (abnData.AddressState) {
      const officeId = `${companyId}_${abnData.AddressState}_01`;
      const officeData = {
        companyId: companyId,
        name: abnData.EntityName,
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
 * 查找现有公司
 */
async function findCompanyByAbn(abn: string) {
  try {
    const snapshot = await firestore.collection('companies')
      .where('abn', '==', abn)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    // 获取办公室信息
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
  } catch (error) {
    console.error(`[ABN Lookup] Error finding company by ABN:`, error);
    return null;
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