import axios from 'axios';
import { firestore } from '@/lib/firebase/admin';
import { v4 as uuidv4 } from 'uuid';

// ABN Lookup API GUID
const ABN_LOOKUP_GUID = "253136de-6266-47f6-a28d-b729867f4b1c";
const ABN_LOOKUP_BASE_URL = "https://abr.business.gov.au/json";

/**
 * 从ABN Lookup API获取公司信息
 */
export async function getCompanyByAbn(abn: string) {
  try {
    console.log(`[ABN Lookup] Searching for ABN: ${abn}`);

    // 清理ABN，移除所有非数字字符（包括空格）
    const cleanAbn = abn.replace(/[^0-9]/g, '');
    console.log(`[ABN Lookup] Cleaned ABN: ${cleanAbn} (original: ${abn})`);
    
    if (cleanAbn.length !== 11) {
      console.error(`[ABN Lookup] Invalid ABN format: ${abn}, cleaned to: ${cleanAbn}, length: ${cleanAbn.length}`);
      return null;
    }

    // 构建API请求URL
    const url = `${ABN_LOOKUP_BASE_URL}/AbnDetails.aspx`;
    const params = {
      abn: cleanAbn,
      guid: ABN_LOOKUP_GUID
    };

    // 发送请求
    console.log(`[ABN Lookup] Sending request to: ${url} with params:`, params);
    const response = await axios.get(url, { params });
    console.log(`[ABN Lookup] Received response status: ${response.status}`);
    
    // 解析JSONP响应
    const responseText = response.data;
    const jsonRegex = /callback\((.*)\)/;
    const match = jsonRegex.exec(responseText);
    
    if (!match || !match[1]) {
      console.error(`[ABN Lookup] Failed to parse JSONP response: ${responseText.substring(0, 200)}...`);
      return null;
    }
    
    const jsonData = JSON.parse(match[1]);
    console.log(`[ABN Lookup] Parsed JSON data:`, jsonData);
    
    // 检查API错误
    if (jsonData && "Message" in jsonData && jsonData.Message) {
      console.error(`[ABN Lookup] API Error for ABN ${abn}: ${jsonData.Message}`);
      return null;
    }
    
    // 检查是否找到公司
    if (!jsonData || !jsonData.Abn) {
      console.log(`[ABN Lookup] No company found for ABN: ${abn}`);
      return null;
    }
    
    // 检查ABN是否有效
    if (jsonData.AbnStatus !== 'Active') {
      console.log(`[ABN Lookup] ABN ${abn} is not active (Status: ${jsonData.AbnStatus})`);
      return null;
    }
    
    console.log(`[ABN Lookup] Found company: ${jsonData.EntityName}`);
    return jsonData;
  } catch (error) {
    console.error(`[ABN Lookup] Error fetching ABN details for ${abn}:`, error);
    return null;
  }
}

/**
 * 搜索公司名称使用ABN Lookup API
 * @param name 要搜索的公司名称
 * @returns 公司数据对象数组或null（如果出错）
 */
export async function getCompaniesByName(name: string) {
  try {
    console.log(`[ABN Lookup] Searching for companies with name: "${name}"`);

    // 确保名称不为空
    if (!name || !name.trim()) {
      console.error(`[ABN Lookup] Invalid company name: empty string`);
      return null;
    }

    // 处理搜索词
    const searchTerm = name.trim();
    const searchTermLower = searchTerm.toLowerCase();
    
    // 构建API请求URL用于名称搜索
    const url = `${ABN_LOOKUP_BASE_URL}/MatchingNames.aspx`;
    const params = {
      name: searchTerm,
      guid: ABN_LOOKUP_GUID,
      maxResults: 200, // 增加结果数上限，获取更多匹配项
      minimumScore: 20 // 降低匹配得分阈值，获取更多候选结果
    };

    // 发送请求
    console.log(`[ABN Lookup] Sending name search request to: ${url} with params:`, params);
    const response = await axios.get(url, { params });
    console.log(`[ABN Lookup] Received response status: ${response.status}`);
    
    // 解析JSONP响应
    const responseText = response.data;
    const jsonRegex = /callback\((.*)\)/;
    const match = jsonRegex.exec(responseText);
    
    if (!match || !match[1]) {
      console.error(`[ABN Lookup] Failed to parse JSONP response: ${responseText.substring(0, 200)}...`);
      return null;
    }
    
    const jsonData = JSON.parse(match[1]);
    console.log(`[ABN Lookup] Parsed name search JSON data:`, jsonData);
    
    // 检查API错误
    if (jsonData && "Message" in jsonData && jsonData.Message) {
      console.error(`[ABN Lookup] API Error for name search "${name}": ${jsonData.Message}`);
      return null;
    }
    
    // 检查是否找到公司
    if (!jsonData || !jsonData.Names || !Array.isArray(jsonData.Names) || jsonData.Names.length === 0) {
      console.log(`[ABN Lookup] No companies found with name: "${name}"`);
      return [];
    }
    
    // 严格过滤：只选择名称中包含搜索词的公司（不区分大小写）
    const exactMatchCompanies = jsonData.Names.filter((company: any) => {
      if (!company.Name) return false;
      const companyName = company.Name.toLowerCase();
      return companyName.includes(searchTermLower);
    });
    
    console.log(`[ABN Lookup] Found ${exactMatchCompanies.length} companies with name containing "${searchTerm}"`);
    
    // 如果没有精确匹配，返回空数组
    if (exactMatchCompanies.length === 0) {
      console.log(`[ABN Lookup] No companies with name containing "${searchTerm}" found`);
      return [];
    }
    
    // 按匹配得分排序，得分高的优先
    const sortedCompanies = exactMatchCompanies.sort((a: any, b: any) => {
      return (b.Score || 0) - (a.Score || 0);
    });
    
    // 获取所有匹配公司的详细信息（仅限有效ABN）
    const companiesWithDetails = [];
    
    for (const company of sortedCompanies) { // 处理所有匹配结果，而不是限制为前20个
      if (company.Abn) {
        try {
          // 获取每个ABN的完整详细信息
          const abnDetails = await getCompanyByAbn(company.Abn);
          if (abnDetails) {
            // 仅包括活跃企业
            companiesWithDetails.push({
              ...abnDetails,
              Score: company.Score,
              MatchedName: company.Name
            });
          }
        } catch (error) {
          console.error(`[ABN Lookup] Error fetching details for ABN ${company.Abn}:`, error);
          // 继续处理下一个公司
          continue;
        }
      }
    }
    
    console.log(`[ABN Lookup] Found ${companiesWithDetails.length} active companies for name: "${name}"`);
    
    // 返回所有找到的公司，不再限制结果数量
    return companiesWithDetails;
  } catch (error) {
    console.error(`[ABN Lookup] Error searching companies by name "${name}":`, error);
    return null;
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
 * 将ABN Lookup API数据保存到数据库
 */
export async function saveCompanyFromAbnLookup(abnData: any) {
  try {
    console.log(`[ABN Lookup] Saving company data to database:`, abnData);
    
    // 确保ABN格式正确（只包含数字）
    const cleanAbn = abnData.Abn.replace(/[^0-9]/g, '');
    
    // 检查该ABN是否已存在于数据库中
    const existingCompany = await findCompanyByAbn(cleanAbn);
    
    if (existingCompany) {
      console.log(`[ABN Lookup] Company with ABN ${cleanAbn} already exists with ID: ${existingCompany.id}`);
      // 返回现有公司数据，添加API标记
      return {
        ...existingCompany,
        _isFromAbnLookup: true
      };
    }
    
    // 如果公司不存在，创建新记录
    // 根据需求映射字段
    const companyData = {
      abn: cleanAbn, // 存储干净的ABN（只有数字）
      name_en: abnData.EntityName,
      description: `${abnData.EntityName} is a registered business in Australia with ABN: ${cleanAbn}.`,
      shortDescription: `${abnData.EntityName} is a registered business in Australia.`,
      location: abnData.AddressState || 'Australia',
      website: '', // ABN Lookup API不提供网站信息
      industry: '', // 将industry设为空字符串，不再使用mapBusinessType
      teamSize: '',
      services: [], // 初始为空，后续可更新
      languages: ['English'], // 默认为英语
      rating: 0,
      foundedYear: abnData.AbnStatusEffectiveFrom ? 
                  new Date(abnData.AbnStatusEffectiveFrom).getFullYear().toString() : 
                  new Date().getFullYear().toString()
    };
    
    // 查询当前最大的公司ID
    let companyId = '';
    try {
      // 直接获取所有公司文档，不使用范围过滤
      const companyRef = firestore.collection('companies');
      const snapshot = await companyRef.get();
      
      // 收集所有符合COMP_XXXXX格式的ID
      const companyIds: string[] = [];
      snapshot.forEach(doc => {
        const docId = doc.id;
        if (docId.match(/^COMP_\d+$/)) {
          companyIds.push(docId);
        }
      });
      
      console.log(`[ABN Lookup] Found ${companyIds.length} company IDs with COMP_ format`);
      
      if (companyIds.length > 0) {
        // 对ID进行排序以找出最大值
        companyIds.sort((a, b) => {
          const numA = parseInt(a.replace('COMP_', ''), 10);
          const numB = parseInt(b.replace('COMP_', ''), 10);
          return numB - numA; // 降序排列
        });
        
        // 获取当前最大ID
        const currentMaxId = companyIds[0];
        console.log(`[ABN Lookup] Current max company ID: ${currentMaxId}`);
        
        // 解析数字部分
        const matches = currentMaxId.match(/COMP_(\d+)/);
        if (matches && matches[1]) {
          const currentNum = parseInt(matches[1], 10);
          // 生成新ID（数字部分加1）
          const newNum = currentNum + 1;
          companyId = `COMP_${newNum.toString().padStart(5, '0')}`;
        } else {
          // 如果不符合预期格式，从50000开始
          companyId = 'COMP_50000';
        }
      } else {
        // 如果没有现有的公司ID，从50000开始
        companyId = 'COMP_50000';
      }
      
      // 额外检查：确保生成的ID不存在
      let idExists = true;
      let retryCount = 0;
      const maxRetries = 10; // 最多尝试10次
      let baseNum = parseInt(companyId.replace('COMP_', ''), 10);
      
      while (idExists && retryCount < maxRetries) {
        const checkDoc = await firestore.collection('companies').doc(companyId).get();
        if (!checkDoc.exists) {
          idExists = false; // ID不存在，可以使用
        } else {
          // ID存在，生成新的ID（数字加1）
          baseNum++;
          companyId = `COMP_${baseNum.toString().padStart(5, '0')}`;
          retryCount++;
          console.log(`[ABN Lookup] ID ${companyId} already exists, trying next number...`);
        }
      }
      
      // 如果经过多次尝试仍找不到可用ID，生成一个随机ID但仍保持同样格式
      if (idExists) {
        const randomNum = Math.floor(Math.random() * 90000) + 10000; // 生成10000-99999之间的随机数
        companyId = `COMP_${randomNum.toString().padStart(5, '0')}`;
        console.log(`[ABN Lookup] Generated random ID after multiple retries: ${companyId}`);
      }
    } catch (error) {
      console.error('[ABN Lookup] Error getting max company ID:', error);
      // 出错时使用带随机数的ID，但仍保持标准格式
      const randomNum = Math.floor(Math.random() * 90000) + 10000; // 生成10000-99999之间的随机数
      companyId = `COMP_${randomNum.toString().padStart(5, '0')}`;
    }
    
    console.log(`[ABN Lookup] Generated new company ID: ${companyId}`);
    
    // 将公司数据写入数据库
    console.log(`[ABN Lookup] Creating new company record with ID: ${companyId}`, companyData);
    await firestore.collection('companies').doc(companyId).set({
      ...companyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'ABN_LOOKUP_API'
    });
    
    console.log(`[ABN Lookup] Created company with ID: ${companyId}`);
    
    // 创建的办公室数据
    let createdOffice = null;
    
    // 如果有地址信息，创建办公室记录
    if (abnData.AddressState || abnData.AddressPostcode) {
      // 确定州/地区代码
      let stateCode = 'OTH'; // 默认为其他
      
      if (abnData.AddressState) {
        // 将州/地区全名转换为代码
        const stateMapping: {[key: string]: string} = {
          'ACT': 'ACT',
          'Australian Capital Territory': 'ACT',
          'NSW': 'NSW',
          'New South Wales': 'NSW',
          'NT': 'NT',
          'Northern Territory': 'NT',
          'QLD': 'QLD',
          'Queensland': 'QLD',
          'SA': 'SA',
          'South Australia': 'SA',
          'TAS': 'TAS',
          'Tasmania': 'TAS',
          'VIC': 'VIC',
          'Victoria': 'VIC',
          'WA': 'WA',
          'Western Australia': 'WA'
        };
        
        const stateName = abnData.AddressState.trim();
        stateCode = stateMapping[stateName] || 'OTH';
      }
      
      // 获取该州/地区的下一个序号
      const nextOfficeNumber = await getNextOfficeNumberForState(companyId, stateCode);
      
      // 生成办公室ID
      const officeId = `${companyId}_${stateCode}_${nextOfficeNumber}`;
      
      const officeData = {
        companyId: companyId,
        name: abnData.EntityName || '',
        state: abnData.AddressState || '',
        city: '',
        address: abnData.AddressPostcode ? `Postcode: ${abnData.AddressPostcode}` : '',
        postalCode: abnData.AddressPostcode || '',
        country: 'Australia',
        latitude: 0,
        longitude: 0,
        isHeadquarter: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'ABN_LOOKUP_API'
      };
      
      console.log(`[ABN Lookup] Creating office record with ID: ${officeId}`, officeData);
      
      try {
        // 使用生成的ID创建办公室记录
        await firestore.collection('offices').doc(officeId).set(officeData);
        console.log(`[ABN Lookup] Created office with ID: ${officeId}`);
        
        // 保存创建的办公室数据，用于返回
        createdOffice = {
          id: officeId,
          officeId: officeId,
          companyId: companyId,
          name: abnData.EntityName || '',
          address: abnData.AddressPostcode ? `Postcode: ${abnData.AddressPostcode}` : '',
          city: '',
          state: abnData.AddressState || '',
          country: 'Australia',
          postalCode: abnData.AddressPostcode || '',
          latitude: 0,
          longitude: 0,
          isHeadquarter: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error(`[ABN Lookup] Error creating office record: ${error}`);
      }
    }
    
    console.log(`[ABN Lookup] Saved company to database with ID: ${companyId}`);
    
    // 返回完整的公司数据以便API响应
    return {
      id: companyId,
      ...companyData,
      offices: createdOffice ? [createdOffice] : [],
      services: [],
      _isFromAbnLookup: true
    };
  } catch (error) {
    console.error('[ABN Lookup] Error saving company to database:', error);
    return null;
  }
}

/**
 * 通过ABN查找公司
 * @param abn 格式化后的ABN（只包含数字）
 * @returns 公司数据或null
 */
async function findCompanyByAbn(abn: string) {
  try {
    console.log(`[ABN Lookup] Checking if company with ABN ${abn} exists in database`);
    
    const abnCheck = await firestore.collection('companies')
      .where('abn', '==', abn)
      .get();
    
    if (!abnCheck.empty) {
      const company = abnCheck.docs[0];
      const companyData = company.data();
      
      // 获取关联的办公室
      const officesSnapshot = await firestore.collection('offices')
        .where('companyId', '==', company.id)
        .get();
      
      const offices: any[] = [];
      officesSnapshot.forEach(doc => {
        offices.push({
          id: doc.id,
          officeId: doc.id,
          ...doc.data()
        });
      });
      
      return {
        id: company.id,
        ...companyData,
        offices
      };
    }
    
    return null;
  } catch (error) {
    console.error(`[ABN Lookup] Error checking for existing company with ABN ${abn}:`, error);
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