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
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');

    console.log('API请求参数:', { industry, state, limit, search });

    // 构建Firestore查询
    let query: Query<DocumentData> = firestore.collection('companies');

    // 添加筛选条件
    if (industry && industry !== 'all') {
      query = query.where('industries', 'array-contains', industry);
    }

    if (state && state !== 'all') {
      query = query.where('state', '==', state);
    }

    // 执行查询
    const snapshot = await query.limit(limit).get();
    
    let companies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

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
      filters: { industry, state, search }
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