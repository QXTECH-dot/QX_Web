// Optimized route file with ABN Lookup
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { DocumentData, Query } from 'firebase-admin/firestore';
import { getCompanyByAbn, getCompaniesByName, saveCompanyFromAbnLookup } from '@/lib/abnLookup';

// 计算公司信息完整度分数（与前端保持一致）
function getCompanyInfoScore(company: any): number {
  let score = 0;
  if (company.logo) score += 1;
  if (company.description || company.shortDescription || company.fullDescription) score += 1;
  if (company.services && company.services.length > 0) score += Math.min(company.services.length, 3); // 最多加3分
  if (company.languages && company.languages.length > 0) score += 1;
  if (company.offices && company.offices.length > 0) score += 1;
  if (company.website) score += 1;
  if (company.abn) score += 1;
  if (company.industry && company.industry.length > 0) score += 1;
  if (company.verified) score += 1;
  return score;
}

// 批量查询services的优化函数
async function batchQueryServices(companyIds: string[]): Promise<{ [companyId: string]: string[] }> {
  const allServices: { [companyId: string]: string[] } = {};
  
  // 分批查询，每批最多10个ID
  for (let i = 0; i < companyIds.length; i += 10) {
    const batchIds = companyIds.slice(i, i + 10);
    const snapshot = await firestore.collection('services')
      .where('companyId', 'in', batchIds)
      .get();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (!allServices[data.companyId]) allServices[data.companyId] = [];
      if (data.title) allServices[data.companyId].push(data.title);
    });
  }
  
  return allServices;
}

// 批量查询offices的优化函数
async function batchQueryOffices(companyIds: string[]): Promise<{ [companyId: string]: any[] }> {
  const allOffices: { [companyId: string]: any[] } = {};
  
  // 分批查询，每批最多10个ID
  for (let i = 0; i < companyIds.length; i += 10) {
    const batchIds = companyIds.slice(i, i + 10);
    const snapshot = await firestore.collection('offices')
      .where('companyId', 'in', batchIds)
      .get();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (!allOffices[data.companyId]) allOffices[data.companyId] = [];
      allOffices[data.companyId].push(data);
    });
  }
  
  return allOffices;
}

/**
 * GET 处理器 - 获取公司数据，支持搜索功能和ABN Lookup（优化版）
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const MAX_PROCESSING_TIME = 25000; // 降回25秒，适应Vercel环境限制
  
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
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12'); // 默认每页12条
    const limit = parseInt(searchParams.get('limit') || (pageSize * page).toString());
    const search = searchParams.get('search') || searchParams.get('query') || searchParams.get('abn');
    const forceApiSearch = searchParams.get('forceApiSearch') === 'true';

    console.log('API请求参数:', { industry, state, location, page, pageSize, limit, search, forceApiSearch });

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
    let totalCount = 0;
    
    // 优化查询策略：如果没有搜索条件，直接使用Firestore的分页查询
    if (!search || !search.trim()) {
      // 没有搜索条件 - 使用更高效的分页查询
      if (locationCompanyIds) {
        // 有location筛选的情况
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
        
        totalCount = allCompanies.length;
        
        // 基于基本数据进行排序，然后分页
        allCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        companies = allCompanies.slice(startIndex, endIndex);
      } else {
        // 没有location筛选 - 可以使用更高效的查询
        // 先获取总数（只需要获取文档引用，不需要数据）
        const countSnapshot = await query.select().get();
        totalCount = countSnapshot.size;
        
        // 获取当前页数据 - 先获取更多数据用于排序
        const dataQuery = query.limit(pageSize * Math.max(1, page)); // 获取到当前页为止的所有数据
        const snapshot = await dataQuery.get();
        
        let allCompanies = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // 排序然后取当前页
        allCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
        const startIndex = (page - 1) * pageSize;
        companies = allCompanies.slice(startIndex, startIndex + pageSize);
      }
    } else {
      // 有搜索条件 - 需要获取所有数据进行过滤
      if (locationCompanyIds) {
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
        
        // 搜索过滤
        const searchTerm = search.toLowerCase().trim();
        allCompanies = allCompanies.filter((company: any) => {
          const nameMatch = company.name?.toLowerCase().includes(searchTerm);
          const nameEnMatch = company.name_en?.toLowerCase().includes(searchTerm);
          const descMatch = company.description?.toLowerCase().includes(searchTerm);
          const locationMatch = company.location?.toLowerCase().includes(searchTerm);
          const abnMatch = company.abn?.includes(searchTerm);
          
          return nameMatch || nameEnMatch || descMatch || locationMatch || abnMatch;
        });
        
        totalCount = allCompanies.length;
        allCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
        
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        companies = allCompanies.slice(startIndex, endIndex);
      } else {
        const snapshot = await query.get();
        let allCompanies = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // 搜索过滤
        const searchTerm = search.toLowerCase().trim();
        allCompanies = allCompanies.filter((company: any) => {
          const nameMatch = company.name?.toLowerCase().includes(searchTerm);
          const nameEnMatch = company.name_en?.toLowerCase().includes(searchTerm);
          const descMatch = company.description?.toLowerCase().includes(searchTerm);
          const locationMatch = company.location?.toLowerCase().includes(searchTerm);
          const abnMatch = company.abn?.includes(searchTerm);
          
          return nameMatch || nameEnMatch || descMatch || locationMatch || abnMatch;
        });
        
        totalCount = allCompanies.length;
        allCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
        
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        companies = allCompanies.slice(startIndex, endIndex);
      }
    }

    // 优化批量查询：只有在需要时才查询services和offices
    const companyIds = companies.map((c: any) => c.id);
    
    // 并行查询services和offices以提高性能
    const [servicesData, officesData] = await Promise.all([
      // 查询services
      companyIds.length > 0 ? batchQueryServices(companyIds) : Promise.resolve({}),
      // 查询offices  
      companyIds.length > 0 ? batchQueryOffices(companyIds) : Promise.resolve({})
    ]);
    
    // 合并数据
    companies = companies.map((company: any) => ({
      ...company,
      services: servicesData[company.id] || [],
      offices: officesData[company.id] || []
    }));

    // 基于完整数据进行最终排序
    companies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));

    // 搜索过滤已在分页查询中处理，无需重复过滤

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
            console.log(`[ABN Lookup] 找到 ${nameResults.length} 个匹配公司，开始批量录入所有公司`);
            
            // 批量保存所有找到的公司（优化版）
            const savePromises = nameResults.map(async (companyData, index) => {
              try {
                console.log(`[ABN Lookup] 保存公司 ${index + 1}/${nameResults.length}: ${companyData.EntityName}`);
                const savedCompany = await saveCompanyFromAbnLookup(companyData);
                if (savedCompany) {
                  console.log(`[ABN Lookup] ✅ 成功保存: ${savedCompany.id} - ${companyData.EntityName}`);
                  return savedCompany;
                } else {
                  console.error(`[ABN Lookup] ❌ 保存失败: ${companyData.EntityName} - saveCompanyFromAbnLookup返回null`);
                  return null;
                }
              } catch (error) {
                console.error(`[ABN Lookup] ❌ 保存异常: ${companyData.EntityName}`, error);
                return null;
              }
            });
            
            // 等待所有保存操作完成
            const savedResults = await Promise.all(savePromises);
            abnResults = savedResults.filter(result => result !== null);
            
            console.log(`[ABN Lookup] 批量录入完成：${abnResults.length}/${nameResults.length} 个公司成功保存`);
          }
        }

        if (abnResults.length > 0) {
          // 过滤重复的ABN
          const existingAbns = new Set(companies.map(c => c.abn).filter(Boolean));
          const newCompanies = abnResults.filter(c => c.abn && !existingAbns.has(c.abn));
          
          if (newCompanies.length > 0) {
            // 🎯 优化展示顺序：本地数据优先，然后是ABN lookup数据
            if (forceApiSearch) {
              // 强制搜索时只显示ABN结果
              companies = newCompanies;
              console.log(`[ABN Lookup] 强制搜索：只显示ABN结果 ${newCompanies.length} 个公司`);
            } else {
              // 正常搜索：本地数据优先，ABN数据排在后面
              companies = [...companies, ...newCompanies];
              console.log(`[ABN Lookup] 本地数据优先：${companies.length - newCompanies.length} 个本地公司 + ${newCompanies.length} 个ABN公司`);
            }
            
            // 🔧 调试：详细记录返回的公司数据
            console.log(`[ABN Lookup] 最终返回的公司列表:`, companies.map((c, index) => ({
              index: index + 1,
              id: c.id,
              name: c.name_en || c.name,
              abn: c.abn,
              source: c.source || '本地数据库',
              isFromAbnLookup: c._isFromAbnLookup || false
            })));
            
            // 更新总数
            totalCount = companies.length;
            
            // 返回结果
            return NextResponse.json({
              success: true,
              data: companies,
              total: totalCount,
              page: page,
              pageSize: pageSize,
              totalPages: Math.ceil(totalCount / pageSize),
              filters: { industry, state, location, search }
            });
          }
        }
      } catch (error) {
        console.error('[ABN Lookup] 查找过程出错:', error);
        // ABN查找失败不影响返回现有结果
      }
    }

    // === ABN Lookup 自动补全 ===
    if (companies.length === 0 && search && search.trim()) {
      console.log('[ABN Lookup] 开始ABN查找流程');
      
      // 设置整体超时时间（25秒，留给serverless环境一些缓冲）
      const abnLookupTimeout = 25000;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('ABN Lookup timeout')), abnLookupTimeout);
      });
      
      try {
        const abnLookupProcess = async () => {
          let abnResults: any[] = [];
          
          // 优先尝试ABN查找
          if (/^\d{11}$/.test(search.trim().replace(/[^0-9]/g, ''))) {
            const abn = search.trim().replace(/[^0-9]/g, '');
            console.log('[ABN Lookup] 尝试ABN查找:', abn);
            const abnData = await getCompanyByAbn(abn);
            if (abnData) {
              const savedCompany = await saveCompanyFromAbnLookup(abnData);
              if (savedCompany) {
                abnResults = [savedCompany];
                console.log('[ABN Lookup] ABN查找成功:', savedCompany);
              }
            }
          }
          
          // 如果不是ABN或ABN查不到，尝试公司名查找
          if (abnResults.length === 0) {
            console.log('[ABN Lookup] 尝试公司名查找:', search.trim());
            const nameResults = await getCompaniesByName(search.trim());
            if (nameResults && nameResults.length > 0) {
              console.log(`[ABN Lookup] 找到 ${nameResults.length} 个匹配的公司，开始批量录入所有公司`);
              
              // 批量处理所有找到的公司（优化版）
              const savePromises = nameResults.map(async (companyData, index) => {
                try {
                  console.log(`[ABN Lookup] 自动录入 ${index + 1}/${nameResults.length}: ${companyData.EntityName}`);
                  const savedCompany = await saveCompanyFromAbnLookup(companyData);
                  if (savedCompany) {
                    console.log(`[ABN Lookup] ✅ 自动录入成功: ${(savedCompany as any).name_en || savedCompany.id}`);
                    return savedCompany;
                  }
                  console.error(`[ABN Lookup] ❌ 自动录入失败: ${companyData.EntityName}`);
                  return null;
                } catch (error) {
                  console.error(`[ABN Lookup] ❌ 自动录入异常: ${companyData.EntityName}`, error);
                  return null;
                }
              });
              
              // 等待所有保存操作完成
              const savedResults = await Promise.all(savePromises);
              abnResults = savedResults.filter(result => result !== null);
              
              console.log(`[ABN Lookup] 自动批量录入完成：${abnResults.length}/${nameResults.length} 个公司成功保存`);
            }
          }
          
          return abnResults;
        };
        
        // 执行ABN查找，带超时控制
        const abnResults = await Promise.race([
          abnLookupProcess(),
          timeoutPromise
        ]) as any[];
        
        if (abnResults.length > 0) {
          companies = abnResults;
          console.log(`[ABN Lookup] 自动查找并入库成功，共 ${abnResults.length} 个公司`);
          return NextResponse.json({
            success: true,
            data: companies,
            total: companies.length,
            message: `Found ${abnResults.length} ${abnResults.length === 1 ? 'company' : 'companies'} in Australian Business Register and added to our database.`,
            filters: { industry, state, search: search }
          });
        } else {
          console.log('[ABN Lookup] 自动查找无结果');
        }
      } catch (error) {
        console.error('[ABN Lookup] 查找过程出错:', error);
        if (error instanceof Error && error.message.includes('timeout')) {
          console.log('[ABN Lookup] 查找超时，返回部分结果');
          // 超时情况下，仍然尝试返回已有数据
        }
      }
    }

    console.log(`返回 ${companies.length} 家公司`);

    const processingTime = Date.now() - startTime;
    console.log(`请求处理完成，耗时: ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      data: companies,
      total: totalCount,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
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