// Optimized route file with ABN Lookup
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { DocumentData, Query } from 'firebase-admin/firestore';
import { getCompanyByAbn, getCompaniesByName, saveCompanyFromAbnLookup } from '@/lib/abnLookup';

/**
 * GET 处理器 - 获取公司数据，支持搜索功能和ABN Lookup（优化版）
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const MAX_PROCESSING_TIME = 25000; // 25秒最大处理时间
  
  // 检查超时的函数
  const checkTimeout = () => {
    if (Date.now() - startTime > MAX_PROCESSING_TIME) {
      throw new Error('Request processing timeout');
    }
  };
  
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const state = searchParams.get('state');
    const location = searchParams.get('location');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || searchParams.get('query') || searchParams.get('abn');
    const forceApiSearch = searchParams.get('forceApiSearch') === 'true';

    console.log('API请求参数:', { industry, state, location, limit, search, forceApiSearch });

    // 判断搜索类型
    const isAbnSearch = search && /^\d{11}$/.test(search.replace(/[^0-9]/g, ''));
    const isCompanyNameSearch = search && search.trim().length >= 3 && !isAbnSearch;

    checkTimeout();

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
        company.name_en?.toLowerCase().includes(searchTerm) ||
        company.description?.toLowerCase().includes(searchTerm) ||
        company.location?.toLowerCase().includes(searchTerm) ||
        company.abn?.includes(searchTerm) ||
        (company.services && Array.isArray(company.services) && 
         company.services.some((service: string) => 
           service.toLowerCase().includes(searchTerm)
         ))
      );
    }

    checkTimeout();

    // === ABN Lookup 功能（优化版）===
    // 如果是ABN搜索或公司名搜索且结果不足，尝试ABN查找
    const shouldRunAbnLookup = search && search.trim() && (
      (isAbnSearch) || // ABN搜索
      (isCompanyNameSearch && companies.length <= 3) || // 公司名搜索且结果少
      (forceApiSearch) // 强制API搜索
    );

    if (shouldRunAbnLookup && !location && !industry && !state) { // 只在没有其他筛选条件时进行ABN查找
      console.log('[ABN Lookup] 开始查找流程');
      
      try {
        let abnResults: any[] = [];
        
        if (isAbnSearch) {
          // ABN搜索：直接查找
          console.log(`[ABN Lookup] ABN搜索: ${search}`);
          const cleanAbn = search.replace(/[^0-9]/g, '');
          const abnData = await getCompanyByAbn(cleanAbn);
          
          if (abnData) {
            const savedCompany = await saveCompanyFromAbnLookup(abnData);
            if (savedCompany) {
              abnResults = [savedCompany];
              console.log('[ABN Lookup] ABN查找成功');
            }
          }
        } else if (isCompanyNameSearch) {
          // 公司名搜索：查找匹配的公司
          console.log(`[ABN Lookup] 公司名搜索: ${search}`);
          const nameResults = await getCompaniesByName(search);
          
          if (nameResults && nameResults.length > 0) {
            console.log(`[ABN Lookup] 找到 ${nameResults.length} 个匹配公司`);
            
            // 保存找到的公司
            for (const companyData of nameResults) {
              try {
                const savedCompany = await saveCompanyFromAbnLookup(companyData);
                if (savedCompany) {
                  abnResults.push(savedCompany);
                }
              } catch (error) {
                console.error('[ABN Lookup] 保存公司失败:', error);
              }
            }
          }
        }

        if (abnResults.length > 0) {
          // 合并ABN查找结果，避免重复
          const existingAbns = new Set(companies.map(c => c.abn).filter(Boolean));
          const newCompanies = abnResults.filter(c => c.abn && !existingAbns.has(c.abn));
          
          if (newCompanies.length > 0) {
            companies = [...companies, ...newCompanies];
            console.log(`[ABN Lookup] 添加了 ${newCompanies.length} 个新公司`);
            
            // 返回结果并标注来源
            return NextResponse.json({
              success: true,
              data: companies,
              total: companies.length,
              message: `Found ${newCompanies.length} additional ${newCompanies.length === 1 ? 'company' : 'companies'} from Australian Business Register.`,
              filters: { industry, state, location, search }
            });
          }
        }
      } catch (error) {
        console.error('[ABN Lookup] 查找过程出错:', error);
        // ABN查找失败不影响返回现有结果
      }
    }

    console.log(`返回 ${companies.length} 家公司`);

    const processingTime = Date.now() - startTime;
    console.log(`请求处理完成，耗时: ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      data: companies,
      total: companies.length,
      filters: { industry, state, location, search },
      processingTime
    });

  } catch (error) {
    console.error('获取公司数据失败:', error);
    
    const processingTime = Date.now() - startTime;
    
    // 如果是超时错误，返回504
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json({
        success: false,
        error: 'Request timeout - please try again with more specific search criteria',
        data: [],
        processingTime
      }, { status: 504 });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      data: [],
      processingTime
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