import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Company } from '@/types/company';
import { Office } from '@/types/office';
import { DocumentData, Query, CollectionReference } from 'firebase-admin/firestore';
import { getCompanyByAbn, saveCompanyFromAbnLookup, getCompaniesByName } from '@/lib/abnLookup';
import { isValidABN, cleanABNNumber } from '@/lib/utils';
import { stringSimilarity } from '@/components/search/FuzzySearch';

// 告诉 Next.js 这个路由需要动态处理
export const dynamic = 'force-dynamic';

// Minimum match score to be considered a relevant result
const MATCH_THRESHOLD = 0.6;
// Number of database results below which we trigger API search
const MIN_RESULTS_THRESHOLD = 5;

/**
 * GET 处理器 - 获取公司数据，支持搜索功能和权重排序
 */
export async function GET(request: Request) {
  console.log('GET /api/companies - Starting request processing');
  
  try {
    // 获取 URL 并解析查询参数
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query') || '';
    const location = searchParams.get('location') || '';
    const abn = searchParams.get('abn') || '';
    const industry = searchParams.get('industry') || '';
    const services = searchParams.getAll('service');
    const forceApiSearch = searchParams.get('forceApiSearch') === 'true';
    
    console.log('Search params:', { query, location, abn, industry, services, forceApiSearch });
    
    // 检查 Firebase Admin 是否已初始化
    if (!firestore) {
      console.error('Firestore is not initialized');
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }
    
    // 处理ABN，去除所有非数字字符
    const cleanAbn = cleanABNNumber(abn);
    console.log('Cleaned ABN for search:', abn, '->', cleanAbn);
    
    // 同样处理query参数，检查是否可能是ABN
    const cleanQuery = cleanABNNumber(query);
    const queryMightBeAbn = cleanQuery.length === 11;
    
    // 确定是否是ABN搜索及要搜索的ABN
    const isAbnSearch = cleanAbn.length === 11 || queryMightBeAbn;
    const abnToSearch = cleanAbn.length === 11 ? cleanAbn : (queryMightBeAbn ? cleanQuery : '');

    // Debug输出
    console.log(`Search analysis: isAbnSearch=${isAbnSearch}, abnToSearch="${abnToSearch}", forceApiSearch=${forceApiSearch}`);
    
    // 如果是ABN搜索，先尝试直接查询
    if (isAbnSearch && abnToSearch) {
      console.log(`Performing direct ABN search for: ${abnToSearch}`);
      
      try {
        // 手动获取所有公司文档进行筛选
        const companiesSnapshot = await firestore.collection('companies').get();
        const matchingCompanies: any[] = [];
        
        // 遍历所有公司，查找ABN匹配的(注意清理每个ABN进行比较)
        companiesSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.abn) {
            const docAbn = cleanABNNumber(data.abn);
            if (docAbn === abnToSearch) {
              matchingCompanies.push({
                id: doc.id,
                ...data
              });
            }
          }
        });
        
        if (matchingCompanies.length > 0) {
          console.log(`Found ${matchingCompanies.length} companies with ABN ${abnToSearch}`);
          const company = matchingCompanies[0];
          const companyId = company.id;
          
          // 获取关联的办公室数据
          const officesSnapshot = await firestore.collection('offices')
            .where('companyId', '==', companyId)
            .get();
          
          const offices: Office[] = [];
          officesSnapshot.forEach(doc => {
            offices.push({
              id: doc.id,
              officeId: doc.id,
              companyId: companyId,
              name: doc.data().name || '',
              address: doc.data().address || '',
              city: doc.data().city || '',
              state: doc.data().state || '',
              country: doc.data().country || 'Australia',
              latitude: doc.data().latitude || 0,
              longitude: doc.data().longitude || 0,
              isHeadquarter: doc.data().isHeadquarter || false,
              createdAt: doc.data().createdAt,
              updatedAt: doc.data().updatedAt
            });
          });
          
          // 获取关联的服务数据
          const servicesSnapshot = await firestore.collection('services')
            .where('companyId', '==', companyId)
            .get();
          
          const services: string[] = [];
          servicesSnapshot.forEach(doc => {
            if (doc.data().title) {
              services.push(doc.data().title);
            }
          });
          
          // 构建完整的公司对象并返回
          company.offices = offices;
          company.services = services;
          console.log(`Successfully retrieved company with ABN ${abnToSearch}`);
          return NextResponse.json({ companies: [company] }, { status: 200 });
        }
        
        // 如果数据库没有找到，尝试ABN Lookup
        console.log(`No company found with ABN ${abnToSearch} in database, trying ABN Lookup API`);
        
        // 从ABN Lookup API获取公司信息
        const abnData = await getCompanyByAbn(abnToSearch);
        
        if (abnData) {
          // 将数据保存到数据库
          const savedCompany = await saveCompanyFromAbnLookup(abnData);
          
          if (savedCompany) {
            console.log(`Company retrieved from ABN Lookup API and saved to database: ${savedCompany.id}`);
            return NextResponse.json({ companies: [savedCompany] }, { status: 200 });
          }
        }
        
        // 如果API没有返回结果或保存失败
        console.log('No companies found matching the ABN and no data from ABN Lookup API');
        return NextResponse.json({ companies: [], message: 'No companies found matching this ABN.' }, { status: 200 });
      } catch (error) {
        console.error(`Error during direct ABN search:`, error);
        // 出错时继续常规搜索流程
      }
    }

    // 如果不是ABN搜索或ABN搜索失败，执行标准搜索
    console.log('Executing standard search query');
    
    // 开始构建 Firestore 查询
    let companiesQuery: Query<DocumentData> | CollectionReference<DocumentData> = firestore.collection('companies');
    
    try {
      // 如果有行业查询
      if (industry) {
        console.log('Adding industry filter:', industry);
        companiesQuery = (companiesQuery as CollectionReference<DocumentData>).where('industry', '==', industry);
      }
      
      console.log('Executing base query');
      // 执行基础查询
      let snapshot = await companiesQuery.get();
      
      // 如果集合不存在或为空
      if (snapshot.empty) {
        console.log('No companies found matching the query');
        return NextResponse.json({ companies: [] }, { status: 200 });
      }
      
      console.log(`Found ${snapshot.docs.length} companies`);
      
      // 获取所有公司 ID
      const companyIds = snapshot.docs.map(doc => doc.id);
      
      // 将公司 ID 分成最多 30 个一组的批次
      const batchSize = 30;
      const companyIdBatches = [];
      for (let i = 0; i < companyIds.length; i += batchSize) {
        companyIdBatches.push(companyIds.slice(i, i + batchSize));
      }
      
      console.log(`Split companies into ${companyIdBatches.length} batches`);
      
      // 办公室数据映射
      const officesByCompany: Record<string, Office[]> = {};
      
      // 批量查询办公室数据
      for (const batch of companyIdBatches) {
        console.log(`Querying offices for batch of ${batch.length} companies`);
        try {
          const batchOfficesSnapshot = await firestore.collection('offices')
            .where('companyId', 'in', batch)
            .get();
          
          batchOfficesSnapshot.docs.forEach(officeDoc => {
            const officeData = officeDoc.data();
            const companyId = officeData.companyId as string;
            
            if (!officesByCompany[companyId]) {
              officesByCompany[companyId] = [];
            }
            
            const office: Office = {
              id: officeDoc.id,
              officeId: officeDoc.id,
              companyId: companyId,
              name: officeData.name || '',
              address: officeData.address || '',
              city: officeData.city || '',
              state: officeData.state || '',
              country: officeData.country || 'Australia',
              latitude: officeData.latitude || 0,
              longitude: officeData.longitude || 0,
              isHeadquarter: officeData.isHeadquarter || false,
              createdAt: officeData.createdAt,
              updatedAt: officeData.updatedAt
            };
            
            officesByCompany[companyId].push(office);
          });
        } catch (error) {
          console.error('Error querying offices:', error);
          throw error;
        }
      }
      
      console.log('Finished querying offices');
      
      // 服务数据映射
      const servicesByCompany: Record<string, string[]> = {};
      
      // 批量查询服务数据
      for (const batch of companyIdBatches) {
        console.log(`Querying services for batch of ${batch.length} companies`);
        try {
          const batchServicesSnapshot = await firestore.collection('services')
            .where('companyId', 'in', batch)
            .get();
          
          batchServicesSnapshot.docs.forEach(serviceDoc => {
            const serviceData = serviceDoc.data();
            const companyId = serviceData.companyId as string;
            
            if (!servicesByCompany[companyId]) {
              servicesByCompany[companyId] = [];
            }
            
            servicesByCompany[companyId].push(serviceData.title || '');
          });
        } catch (error) {
          console.error('Error querying services:', error);
          throw error;
        }
      }
      
      console.log('Finished querying services');
      
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
      
      console.log('Combined all data for companies');
      
      // For company name search, calculate match scores
      let isCompanyNameSearch = false;
      let relevantResultsCount = 0;
      let companiesWithScores: Array<{ company: any, score: number }> = [];
      
      if (query && !isAbnSearch) {
        const queryLower = query.toLowerCase();
        isCompanyNameSearch = true;
        
        // Calculate match scores for relevant filtering
        companiesWithScores = companies.map(company => {
          let score = 0;
          
          // Name match (highest priority)
          if (company.name_en) {
            score = Math.max(score, stringSimilarity(company.name_en.toLowerCase(), queryLower));
          }
          
          // Service match (medium priority)
          if (company.services && Array.isArray(company.services)) {
            for (const service of company.services) {
              if (typeof service === 'string') {
                score = Math.max(score, stringSimilarity(service.toLowerCase(), queryLower) * 0.7);
              }
            }
          }
          
          // Industry match (medium priority)
          if (company.industry && typeof company.industry === 'string') {
            score = Math.max(score, stringSimilarity(company.industry.toLowerCase(), queryLower) * 0.6);
          }
          
          return { company, score };
        });
        
        // Count relevant results (score >= threshold)
        relevantResultsCount = companiesWithScores.filter(item => item.score >= MATCH_THRESHOLD).length;
        console.log(`Found ${relevantResultsCount} relevant results for company name search "${query}"`);
        
        // Filter and sort by score
        companies = companiesWithScores
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(item => item.company);
      }
      
      // 应用位置过滤
      if (location) {
        console.log('Applying location filter:', location);
        
        // 将位置参数拆分为多个地区
        const locations = location.split(',').map(loc => loc.trim().toLowerCase());
        console.log('Locations after splitting:', locations);
        
        companies = companies.filter((company: any) => {
          // 如果没有选择地区，则不进行筛选
          if (locations.length === 0) {
            return true;
          }
          
          // 检查公司自身的 location 字段
          if (company.location) {
            const companyLocation = company.location.toLowerCase();
            // 检查任何地区是否匹配公司位置
            for (const loc of locations) {
              if (companyLocation.includes(loc)) {
                return true;
              }
            }
          }
          
          // 检查公司的办公室是否在任何选定地区
          if (company.offices && company.offices.length > 0) {
            return company.offices.some((office: any) => {
              if (!office.state) return false;
              
              const stateValue = office.state.toLowerCase();
              
              // 检查任何地区是否匹配办公室的州/地区
              return locations.some(loc => 
                stateValue === loc || 
                stateValue.includes(loc)
              );
            });
          }
          
          return false;
        });
        
        console.log(`After location filtering, found ${companies.length} companies`);
      }
      
      // 按名称排序
      companies.sort((a: any, b: any) => {
        const nameA = (a.name_en || '').toLowerCase();
        const nameB = (b.name_en || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      // Check if need to fetch from ABN Lookup API for company name search
      if (isCompanyNameSearch && 
          ((relevantResultsCount < MIN_RESULTS_THRESHOLD || forceApiSearch)) && 
          query.trim().length >= 3) {
        
        if (forceApiSearch) {
          console.log('Force API search requested for company name search');
        } else {
          console.log(`Found only ${relevantResultsCount} relevant companies in database, trying ABN Lookup API by name`);
        }
        
        try {
          // Get companies from ABN Lookup API by name
          const apiCompanies = await getCompaniesByName(query);
          
          if (apiCompanies && apiCompanies.length > 0) {
            console.log(`Found ${apiCompanies.length} companies from ABN Lookup API`);
            
            // Save each company to database and collect results
            const savedApiCompanies = [];
            for (const apiCompany of apiCompanies) {
              const savedCompany = await saveCompanyFromAbnLookup(apiCompany);
              if (savedCompany) {
                savedApiCompanies.push(savedCompany);
              }
            }
            
            if (savedApiCompanies.length > 0) {
              console.log(`Saved ${savedApiCompanies.length} companies from ABN Lookup API to database`);
              
              // Add API companies to results, avoid duplicates by ABN
              const existingAbns = new Set(companies.map((c: any) => c.abn));
              for (const apiCompany of savedApiCompanies) {
                if (!existingAbns.has(apiCompany.abn)) {
                  companies.push(apiCompany);
                  existingAbns.add(apiCompany.abn);
                }
              }
              
              // Re-sort combined results
              companies.sort((a: any, b: any) => {
                const nameA = (a.name_en || '').toLowerCase();
                const nameB = (b.name_en || '').toLowerCase();
                return nameA.localeCompare(nameB);
              });
            }
          } else {
            console.log('No companies found from ABN Lookup API');
          }
        } catch (error) {
          console.error('Error fetching companies by name from ABN Lookup API:', error);
          // Continue without API results on error
        }
      }
      
      // If we received companies from API, add message for frontend
      const includesApiResults = companies.some((c: any) => c._isFromAbnLookup);
      const responseMessage = includesApiResults 
        ? 'Additional results retrieved from Australian Business Register.' 
        : (forceApiSearch && companies.length === 0 ? 'No additional companies found in the Business Register.' : undefined);
      
      console.log(`Returning ${companies.length} companies${includesApiResults ? ' (including ABN Lookup results)' : ''}`);
      return NextResponse.json({ 
        companies, 
        message: responseMessage 
      }, { status: 200 });
    } catch (error) {
      console.error('Error in Firestore query:', error);
      return NextResponse.json(
        { error: 'Failed to query Firestore database', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/companies:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

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
      { error: 'Failed to create company', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 