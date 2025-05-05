import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Company } from '@/types/company';
import { Office } from '@/types/office';

// 告诉 Next.js 这个路由需要动态处理
export const dynamic = 'force-dynamic';

/**
 * GET 处理器 - 获取公司数据，支持搜索功能和权重排序
 */
export async function GET(request: Request) {
  try {
    // 获取 URL 并解析查询参数
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query') || '';
    const location = searchParams.get('location') || '';
    const abn = searchParams.get('abn') || '';
    const industry = searchParams.get('industry') || '';
    const services = searchParams.getAll('service');
    
    console.log('Search params:', { query, location, abn, industry, services });
    
    // 开始构建 Firestore 查询
    let companiesQuery = firestore.collection('companies');
    
    // 如果有 ABN 查询，优先使用 ABN 查询（精确匹配）
    if (abn) {
      companiesQuery = companiesQuery.where('abn', '==', abn);
    }
    
    // 如果有行业查询
    if (industry) {
      companiesQuery = companiesQuery.where('industry', '==', industry);
    }
    
    // 执行基础查询
    let snapshot = await companiesQuery.get();
    
    // 如果集合不存在或为空
    if (snapshot.empty) {
      return NextResponse.json({ companies: [] }, { status: 200 });
    }
    
    // 获取所有公司 ID
    const companyIds = snapshot.docs.map(doc => doc.id);
    
    // 将公司 ID 分成最多 30 个一组的批次
    const batchSize = 30;
    const companyIdBatches = [];
    for (let i = 0; i < companyIds.length; i += batchSize) {
      companyIdBatches.push(companyIds.slice(i, i + batchSize));
    }
    
    // 办公室数据映射
    const officesByCompany = {};
    
    // 批量查询办公室数据
    for (const batch of companyIdBatches) {
      const batchOfficesSnapshot = await firestore.collection('offices')
        .where('companyId', 'in', batch)
        .get();
      
      batchOfficesSnapshot.docs.forEach(officeDoc => {
        const officeData = officeDoc.data();
        const companyId = officeData.companyId;
        
        if (!officesByCompany[companyId]) {
          officesByCompany[companyId] = [];
        }
        
        officesByCompany[companyId].push({
          ...officeData,
          officeId: officeDoc.id,
          id: officeDoc.id,
          isHeadquarter: officeData.isHeadquarter || false,
          isHeadquarters: officeData.isHeadquarter || false // 兼容两种字段名
        });
      });
    }
    
    // 服务数据映射
    const servicesByCompany = {};
    
    // 批量查询服务数据
    for (const batch of companyIdBatches) {
      const batchServicesSnapshot = await firestore.collection('services')
        .where('companyId', 'in', batch)
        .get();
      
      batchServicesSnapshot.docs.forEach(serviceDoc => {
        const serviceData = serviceDoc.data();
        const companyId = serviceData.companyId;
        
        if (!servicesByCompany[companyId]) {
          servicesByCompany[companyId] = [];
        }
        
        servicesByCompany[companyId].push(serviceData.title || '');
      });
    }
    
    // 组合所有数据
    let companies = snapshot.docs.map(doc => {
      const data = doc.data();
      const companyId = doc.id;
      
      return {
        id: companyId,
        ...data as Omit<Company, 'id'>,
        offices: officesByCompany[companyId] || [],
        services: servicesByCompany[companyId] || []
      };
    });
    
    // 应用位置过滤
    if (location) {
      companies = companies.filter(company => {
        // 检查公司自身的 location 字段
        if (company.location && company.location.includes(location)) {
          return true;
        }
        
        // 检查公司的办公室是否在该位置
        return company.offices?.some(office => 
          office.state === location || 
          office.city?.includes(location) || 
          office.address?.includes(location)
        );
      });
    }
    
    // 应用通用查询过滤和权重排序
    if (query) {
      const queryLower = query.toLowerCase();
      
      // 创建带有权重得分的公司数组
      // 创建带有权重得分的公司数组
    const scoredCompanies = companies.map(company => {
      // 初始化匹配得分
      let score = 0;
      let matchFields: string[] = [];
      
      // 名称匹配 - 最高权重 (10分)
      if (company.name_en && typeof company.name_en === 'string' && company.name_en.toLowerCase().includes(queryLower)) {
        score += 10;
        matchFields.push('name');
      }
      
      // ABN 匹配 - 高权重 (8分)
      if (company.abn && typeof company.abn === 'string' && company.abn.includes(queryLower)) {
        score += 8;
        matchFields.push('abn');
      }
      
      // 行业匹配 - 中高权重 (6分)
      if (company.industry && typeof company.industry === 'string' && company.industry.toLowerCase().includes(queryLower)) {
        score += 6;
        matchFields.push('industry');
      }
      
      // 服务匹配 - 中等权重 (5分)
      if (company.services && Array.isArray(company.services) && company.services.some(s => 
        typeof s === 'string' && s.toLowerCase().includes(queryLower)
      )) {
        score += 5;
        matchFields.push('services');
      }
      
      // 简介匹配 - 中低权重 (4分)
      if (company.shortDescription && typeof company.shortDescription === 'string' && 
          company.shortDescription.toLowerCase().includes(queryLower)) {
        score += 4;
        matchFields.push('shortDescription');
      }
      
      // 详细描述匹配 - 低权重 (3分)
      if (company.description && typeof company.description === 'string' && 
          company.description.toLowerCase().includes(queryLower)) {
        score += 3;
        matchFields.push('description');
      }
      
      // 团队规模匹配 - 低权重 (2分)
      if (company.teamSize && typeof company.teamSize === 'string' && 
          company.teamSize.toLowerCase().includes(queryLower)) {
        score += 2;
        matchFields.push('teamSize');
      }
      
      // 任何其他字段匹配 - 最低权重 (1分)
      const otherFields = ['slogan', 'website', 'email', 'phone'];
      for (const field of otherFields) {
        if (company[field] && typeof company[field] === 'string' && 
            company[field].toLowerCase().includes(queryLower)) {
          score += 1;
          matchFields.push(field);
        }
      }
      
      // 返回带有分数的公司
      return {
        company,
        score,
        matchFields
      };
    });
      
      // 过滤掉不匹配的公司 (得分为0)
      const matchedCompanies = scoredCompanies.filter(item => item.score > 0);
      
      // 按分数从高到低排序
      matchedCompanies.sort((a, b) => b.score - a.score);
      
      // 提取排序后的公司列表
      companies = matchedCompanies.map(item => ({
        ...item.company,
        matchScore: item.score, // 可选：将匹配分数添加到结果中
        matchFields: item.matchFields // 可选：将匹配的字段添加到结果中
      }));
    }
    
    // 应用服务过滤
    if (services && services.length > 0) {
      companies = companies.filter(company => {
        // 确保公司提供所有请求的服务
        return services.every(service => 
          company.services?.some(s => s.toLowerCase().includes(service.toLowerCase()))
        );
      });
    }
    
    console.log(`Found ${companies.length} companies after filtering and sorting`);
    
    // 返回筛选和排序后的公司数据
    return NextResponse.json({ companies }, { status: 200 });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}
/**
 * GET 处理器 - 获取所有公司数据
 */
// export async function GET() {
//   try {
//     // 查询 Firestore 中的 companies 集合
//     const snapshot = await firestore.collection('companies').get();
    
//     if (snapshot.empty) {
//       return NextResponse.json({ companies: [] }, { status: 200 });
//     }
    
//     // 获取所有公司 ID
//     const companyIds = snapshot.docs.map(doc => doc.id);
    
//     // 将公司 ID 分成最多 30 个一组的批次
//     const batchSize = 30;
//     const companyIdBatches = [];
//     for (let i = 0; i < companyIds.length; i += batchSize) {
//       companyIdBatches.push(companyIds.slice(i, i + batchSize));
//     }
    
//     // 办公室数据映射
//     const officesByCompany = {};
    
//     // 批量查询办公室数据
//     for (const batch of companyIdBatches) {
//       const batchOfficesSnapshot = await firestore.collection('offices')
//         .where('companyId', 'in', batch)
//         .get();
      
//       batchOfficesSnapshot.docs.forEach(officeDoc => {
//         const officeData = officeDoc.data();
//         const companyId = officeData.companyId;
        
//         if (!officesByCompany[companyId]) {
//           officesByCompany[companyId] = [];
//         }
        
//         officesByCompany[companyId].push({
//           ...officeData,
//           officeId: officeDoc.id,
//           id: officeDoc.id,
//           isHeadquarter: officeData.isHeadquarter || false
//         });
//       });
//     }
    
//     // 服务数据映射
//     const servicesByCompany = {};
    
//     // 批量查询服务数据
//     for (const batch of companyIdBatches) {
//       const batchServicesSnapshot = await firestore.collection('services')
//         .where('companyId', 'in', batch)
//         .get();
      
//       batchServicesSnapshot.docs.forEach(serviceDoc => {
//         const serviceData = serviceDoc.data();
//         const companyId = serviceData.companyId;
        
//         if (!servicesByCompany[companyId]) {
//           servicesByCompany[companyId] = [];
//         }
        
//         servicesByCompany[companyId].push(serviceData.title || '');
//       });
//     }
    
//     // 组合所有数据
//     const companies = snapshot.docs.map(doc => {
//       const data = doc.data();
//       const companyId = doc.id;
      
//       return {
//         id: companyId,
//         ...data as Omit<Company, 'id'>,
//         offices: officesByCompany[companyId] || [],
//         services: servicesByCompany[companyId] || []
//       };
//     });
    
//     return NextResponse.json({ companies }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching companies:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch companies' },
//       { status: 500 }
//     );
//   }
// }



/**
 * POST 处理器 - 创建新公司
 * 可以在后续扩展
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 这里可以添加数据验证逻辑
    
    // 创建新的公司文档
    const docRef = await firestore.collection('companies').add(data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Company created successfully',
        id: docRef.id 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
} 