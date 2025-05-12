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
 * 将ABN Lookup API数据保存到数据库
 */
export async function saveCompanyFromAbnLookup(abnData: any) {
  try {
    console.log(`[ABN Lookup] Saving company data to database:`, abnData);
    
    // 确保ABN格式正确（只包含数字）
    const cleanAbn = abnData.Abn.replace(/[^0-9]/g, '');
    
    // 根据需求映射字段
    const companyData = {
      abn: cleanAbn, // 存储干净的ABN（只有数字）
      name_en: abnData.EntityName,
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
      const checkDoc = await firestore.collection('companies').doc(companyId).get();
      if (checkDoc.exists) {
        console.log(`[ABN Lookup] ID ${companyId} already exists, generating alternative...`);
        // 如果ID已存在，使用时间戳
        const timestamp = new Date().getTime();
        companyId = `COMP_T${timestamp}`;
      }
    } catch (error) {
      console.error('[ABN Lookup] Error getting max company ID:', error);
      // 出错时使用时间戳作为备选，确保唯一性
      const timestamp = new Date().getTime();
      companyId = `COMP_T${timestamp}`;
    }
    
    console.log(`[ABN Lookup] Generated new company ID: ${companyId}`);
    
    // 检查已有的ABN - 使用清理后的ABN进行查询
    try {
      const abnCheck = await firestore.collection('companies')
        .where('abn', '==', cleanAbn)
        .get();
      
      if (!abnCheck.empty) {
        console.log(`[ABN Lookup] Company with ABN ${cleanAbn} already exists`);
        // 获取现有公司ID
        const existingCompanyId = abnCheck.docs[0].id;
        
        // 更新现有记录而不是创建新记录
        console.log(`[ABN Lookup] Updating existing company record: ${existingCompanyId}`);
        await firestore.collection('companies').doc(existingCompanyId).update(companyData);
        
        // 使用现有ID
        companyId = existingCompanyId;
      } else {
        // 创建新公司记录
        console.log(`[ABN Lookup] Creating new company record with ID: ${companyId}`, companyData);
        await firestore.collection('companies').doc(companyId).set(companyData);
      }
    } catch (error) {
      console.error('[ABN Lookup] Error checking existing ABN:', error);
      // 创建新公司记录
      console.log(`[ABN Lookup] Creating new company record with ID: ${companyId}`, companyData);
      await firestore.collection('companies').doc(companyId).set(companyData);
    }
    
    console.log(`[ABN Lookup] Created/Updated company with ID: ${companyId}`);
    
    // 如果有地址信息，创建办公室记录
    if (abnData.AddressState || abnData.AddressPostcode) {
      // 先检查是否已有办公室记录
      let officeExists = false;
      try {
        const officeCheck = await firestore.collection('offices')
          .where('companyId', '==', companyId)
          .get();
        
        officeExists = !officeCheck.empty;
      } catch (error) {
        console.error('[ABN Lookup] Error checking existing offices:', error);
      }
      
      if (!officeExists) {
        const officeData = {
          companyId: companyId,
          state: abnData.AddressState || '',
          postalCode: abnData.AddressPostcode || '',
          address: '',
          city: '',
          country: 'Australia',
          isHeadquarter: true
        };
        
        console.log(`[ABN Lookup] Creating office record:`, officeData);
        const officeRef = await firestore.collection('offices').add(officeData);
        console.log(`[ABN Lookup] Created office with ID: ${officeRef.id}`);
      } else {
        console.log(`[ABN Lookup] Office record for company ${companyId} already exists`);
      }
    }
    
    console.log(`[ABN Lookup] Saved company to database with ID: ${companyId}`);
    
    // 返回完整的公司数据以便API响应
    return {
      id: companyId,
      ...companyData,
      offices: abnData.AddressState ? [{
        id: uuidv4(),
        officeId: uuidv4(),
        companyId: companyId,
        name: abnData.EntityName,
        address: '',
        city: '',
        state: abnData.AddressState || '',
        country: 'Australia',
        postalCode: abnData.AddressPostcode || '',
        latitude: 0,
        longitude: 0,
        isHeadquarter: true
      }] : [],
      services: [],
      _isFromAbnLookup: true
    };
  } catch (error) {
    console.error('[ABN Lookup] Error saving company to database:', error);
    return null;
  }
} 