// Fixed route file
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { DocumentData, Query } from 'firebase-admin/firestore';

/**
 * GET 处理器 - 获取公司数据，支持搜索功能和权重排序
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const state = searchParams.get('state');
    const location = searchParams.get('location');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');

    console.log('API请求参数:', { industry, state, location, limit, search });

    // 如果有location参数，先从offices表获取符合条件的companyId
    let locationCompanyIds: string[] | undefined;
    if (location && location !== 'all') {
      const officesSnapshot = await firestore.collection('offices')
        .where('state', '==', location.toUpperCase())
        .get();
      
      locationCompanyIds = Array.from(new Set(
        officesSnapshot.docs.map(doc => doc.data().companyId).filter(id => id)
      ));
      
      console.log(`Found ${locationCompanyIds.length} companies in ${location}`);
      
      // 如果没有找到任何公司，直接返回空结果
      if (locationCompanyIds.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          total: 0,
          filters: { industry, state, location, search }
        });
      }
    }

    // 构建Firestore查询
    let query: Query<DocumentData> = firestore.collection('companies');

    // 添加筛选条件
    if (industry && industry !== 'all') {
      query = query.where('industries', 'array-contains', industry);
    }

    if (state && state !== 'all') {
      query = query.where('state', '==', state);
    }

    // 声明companies变量
    let companies: any[] = [];
    
    // 如果有location筛选，需要通过companyId筛选
    if (locationCompanyIds) {
      // 由于Firestore的in查询限制为10个，需要分批处理
      let allCompanies: any[] = [];
      const batchSize = 10;
      
      for (let i = 0; i < locationCompanyIds.length; i += batchSize) {
        const batchIds = locationCompanyIds.slice(i, i + batchSize);
        const batchQuery = query.where('__name__', 'in', batchIds);
        const batchSnapshot = await batchQuery.get();
        
        allCompanies.push(...batchSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      }
      
      // 限制结果数量
      companies = allCompanies.slice(0, limit);
    } else {
      // 正常查询
      const snapshot = await query.limit(limit).get();
      companies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    // 1. 批量获取所有公司ID
    const companyIds = companies.map((c: any) => c.id);
    // 2. 查询所有匹配这些companyId的services
    let allServices: { [companyId: string]: string[] } = {};
    if (companyIds.length > 0) {
      const servicesSnapshot = await firestore.collection('services')
        .where('companyId', 'in', companyIds.slice(0, 10)) // Firestore in最多10个
            .get();
      // 处理分页
      let remainingIds = companyIds.slice(10);
      let allDocs = [...servicesSnapshot.docs];
      while (remainingIds.length > 0) {
        const batchIds = remainingIds.slice(0, 10);
        const batchSnap = await firestore.collection('services')
          .where('companyId', 'in', batchIds)
            .get();
        allDocs = allDocs.concat(batchSnap.docs);
        remainingIds = remainingIds.slice(10);
      }
      // 聚合
      allDocs.forEach(doc => {
        const data = doc.data();
        if (!allServices[data.companyId]) allServices[data.companyId] = [];
        if (data.title) allServices[data.companyId].push(data.title);
      });
    }
    // 3. 用真实services表覆盖companies的services字段
    companies = companies.map((company: any) => ({
      ...company,
      services: allServices[company.id] || []
    }));

    // 如果有搜索关键词，进行客户端过滤
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      companies = companies.filter((company: any) => 
        company.name?.toLowerCase().includes(searchTerm) ||
        company.description?.toLowerCase().includes(searchTerm) ||
        company.location?.toLowerCase().includes(searchTerm) ||
        (company.services && Array.isArray(company.services) && 
         company.services.some((service: string) => 
           service.toLowerCase().includes(searchTerm)
         ))
      );
    }

    console.log(`返回 ${companies.length} 家公司`);

    return NextResponse.json({
      success: true,
      data: companies,
      total: companies.length,
      filters: { industry, state, location, search }
    });

  } catch (error) {
    console.error('获取公司数据失败:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      data: []
    }, { status: 500 });
  }
}

/**
 * POST 处理器 - 创建新公司
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
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
      { error: 'Failed to create company', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 