import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-admin';
const ABN_LOOKUP_GUID = "253136de-6266-47f6-a28d-b729867f4b1c";
const ABN_LOOKUP_BASE_URL = "https://abr.business.gov.au/json";
const API_TIMEOUT = 8000;

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

// 验证管理员权限的中间件函数 - 临时禁用
function verifyAdminToken(request: NextRequest) {
  // 临时返回admin用户，跳过验证
  return { role: 'admin', email: 'admin@qxnet.com' };
}

/**
 * ABN Registry API 查找公司信息
 */
async function getCompanyByAbn(abn: string) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('ABN API timeout')), API_TIMEOUT);
  });

  try {
    console.log(`[ABN Lookup API] Searching for ABN: ${abn}`);

    // 清理ABN
    const cleanAbn = abn.replace(/[^0-9]/g, '');
    if (cleanAbn.length !== 11) {
      console.error(`[ABN Lookup API] Invalid ABN format: ${abn}`);
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
      console.error(`[ABN Lookup API] Failed to parse JSONP response`);
      return null;
    }
    
    const jsonData = JSON.parse(match[1]);
    
    // 检查错误和有效性
    if (jsonData?.Message || !jsonData?.Abn || jsonData.AbnStatus !== 'Active') {
      console.log(`[ABN Lookup API] Invalid or inactive ABN: ${abn}`);
      return null;
    }
    
    console.log(`[ABN Lookup API] Found company: ${jsonData.EntityName}`);
    return jsonData;
  } catch (error) {
    console.error(`[ABN Lookup API] Error for ABN ${abn}:`, error);
    return null;
  }
}

// GET - ABN lookup
export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const abn = searchParams.get('abn');

    if (!abn) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ABN parameter is required' 
        },
        { status: 400 }
      );
    }

    // 验证ABN格式
    const cleanAbn = abn.replace(/[^0-9]/g, '');
    if (cleanAbn.length !== 11) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ABN must be 11 digits' 
        },
        { status: 400 }
      );
    }

    // 查找公司信息
    const companyData = await getCompanyByAbn(cleanAbn);

    if (companyData && companyData.EntityName) {
      // 处理和格式化返回的数据
      const processedData = {
        ...companyData,
        // 格式化公司名称为首字母大写
        EntityName: formatCompanyName(companyData.EntityName),
        // 格式化交易名称（如果存在）
        TradingName: companyData.TradingName ? formatCompanyName(companyData.TradingName) : null,
        tradingName: companyData.TradingName ? formatCompanyName(companyData.TradingName) : null,
        // 格式化成立时间
        foundedYear: companyData.AbnStatusEffectiveFrom ? 
          new Date(companyData.AbnStatusEffectiveFrom).getFullYear() : 
          null,
        // 提取州信息
        state: companyData.AddressState || null,
        // 提取邮编
        postcode: companyData.AddressPostcode || null,
        // 实体类型
        entityType: companyData.EntityTypeCode || null,
        entityTypeDescription: companyData.EntityTypeName || null,
        // 原始数据保留用于调试
        originalEntityName: companyData.EntityName,
        originalTradingName: companyData.TradingName,
        originalAbnStatusEffectiveFrom: companyData.AbnStatusEffectiveFrom
      };

      console.log(`[ABN Lookup API] Processed data:`, {
        formattedEntityName: processedData.EntityName,
        originalEntityName: processedData.originalEntityName,
        formattedTradingName: processedData.tradingName,
        originalTradingName: processedData.originalTradingName,
        foundedYear: processedData.foundedYear,
        state: processedData.state,
        postcode: processedData.postcode
      });

      return NextResponse.json({
        success: true,
        data: processedData,
        message: `Found company: ${processedData.EntityName}`
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'No active company found with this ABN in ABN Registry'
      });
    }

  } catch (error) {
    console.error('ABN lookup API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}