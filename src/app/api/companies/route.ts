// Fixed route file
import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Company, Office } from '@/types/company';
import { DocumentData, Query, CollectionReference } from 'firebase-admin/firestore';
import { getCompanyByAbn, saveCompanyFromAbnLookup, getCompaniesByName } from '@/lib/abnLookup';
import { isValidABN, cleanABNNumber } from '@/lib/utils';
import { stringSimilarity } from '@/components/search/FuzzySearch';

// 告诉 Next.js 这个路由需要动态处理
export const dynamic = 'force-dynamic';

// Minimum match score to be considered a relevant result
const MATCH_THRESHOLD = 0.5; // 较低的阈值允许更多模糊匹配
// 对于短搜索词使用更高的阈值
const SHORT_SEARCH_MATCH_THRESHOLD = 0.7; // 短搜索词需要更精确的匹配
// Number of database results below which we trigger API search
const MIN_RESULTS_THRESHOLD = 15; // 当数据库结果<=15时触发API搜索
// 最小搜索字符长度
const MIN_SEARCH_LENGTH = 2; // 最小搜索长度为2个字符

// 添加一个常量定义快速返回的公司数量阈值
const QUICK_RESPONSE_THRESHOLD = 12; // 当保存的公司达到12家时立即返回结果

// 定义保存API结果的公司类型
interface CompanyWithApiFlag extends Company {
  _isFromAbnLookup?: boolean;
  abn?: string;
}

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
    
    // 确定是否是公司名称搜索
    const isCompanyNameSearch = query.trim().length > 0 && !isAbnSearch;
    
    // 查询条件：公司名称必须包含搜索词
    const searchTermLower = query.toLowerCase();

    // Debug输出
    console.log(`Search analysis: isAbnSearch=${isAbnSearch}, abnToSearch="${abnToSearch}", forceApiSearch=${forceApiSearch}, searchTerm="${query}"`);
    
    // 如果是ABN搜索，先尝试直接查询
    if (isAbnSearch && abnToSearch) {
      console.log(`Performing direct ABN search for: ${abnToSearch}`);
      
      try {
        // 先在数据库中搜索
        const companiesSnapshot = await firestore.collection('companies')
          .where('abn', '==', abnToSearch)
          .get();

        // 如果在数据库中找到ABN匹配的公司
        if (!companiesSnapshot.empty) {
          const company = companiesSnapshot.docs[0];
          const companyData = company.data() as Omit<Company, 'id'>;
          const companyId = company.id;
          
          console.log(`Found company with ABN ${abnToSearch} in database: ${companyId}`);
          
          // 获取关联的办公室数据
          const officesSnapshot = await firestore.collection('offices')
            .where('companyId', '==', companyId)
            .get();
          
          const offices: Office[] = [];
          officesSnapshot.forEach(doc => {
            const officeData = doc.data();
            offices.push({
              id: doc.id,
              address: officeData.address || '',
              city: officeData.city || '',
              state: officeData.state || '',
              country: officeData.country || 'Australia',
              postalCode: officeData.postalCode || '',
              phone: officeData.phone,
              email: officeData.email,
              isHeadquarters: officeData.isHeadquarter || false
            });
          });
          
          // 获取关联的服务数据
          const servicesSnapshot = await firestore.collection('services')
            .where('companyId', '==', companyId)
            .get();
          
          const companyServices: string[] = [];
          servicesSnapshot.forEach(doc => {
            if (doc.data().title) {
              companyServices.push(doc.data().title);
            }
          });
          
          // 返回完整公司数据
          const resultCompany: Company = {
            id: companyId,
            ...companyData,
            name: companyData.name || companyData.name_en || '',
            location: companyData.location || '',
            teamSize: companyData.teamSize || '',
            services: companyServices,
            offices
          };
          
          return NextResponse.json({ companies: [resultCompany] }, { status: 200 });
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
            
            const apiCompany = savedCompany as unknown as CompanyWithApiFlag;
            
            return NextResponse.json({ 
              companies: [apiCompany],
              message: 'This company information was retrieved from the Australian Business Register.'
            }, { status: 200 });
          }
        }
        
        // 如果API没有返回结果或保存失败
        console.log('No companies found matching the ABN and no data from ABN Lookup API');
        return NextResponse.json({ 
          companies: [], 
          message: 'No companies found matching this ABN. Please try another search.' 
        }, { status: 200 });
      } catch (error) {
        console.error(`Error during direct ABN search:`, error);
        // 出错时继续常规搜索流程
      }
    }

    // 如果不是ABN搜索或ABN搜索失败，执行标准搜索
    console.log('Executing standard search query');
    
    // 开始构建 Firestore 查询
    let companiesQuery: Query<DocumentData> = firestore.collection('companies');
    
    try {
      // 如果有行业查询
      if (industry) {
        console.log('Adding industry filter:', industry);
        companiesQuery = companiesQuery.where('industry', '==', industry);
      }
      
      console.log('Executing base query');
      // 执行基础查询
      let snapshot = await companiesQuery.get();
      
      // 如果集合不存在或为空
      if (snapshot.empty) {
        console.log('No companies found matching the query');
        
        // 如果是公司名称搜索，并且字符串长度>=最小搜索字符长度，尝试ABN Lookup API
        if (isCompanyNameSearch && query.trim().length >= MIN_SEARCH_LENGTH) {
          console.log(`No companies in database, trying ABN Lookup API for name: "${query}"`);
          
          const apiCompanies = await getCompaniesByName(query);
          
          if (apiCompanies && apiCompanies.length > 0) {
            console.log(`Found ${apiCompanies.length} companies from ABN Lookup API`);
            
            // 保存每个公司到数据库
            const savedCompanies: CompanyWithApiFlag[] = [];
            for (const apiCompany of apiCompanies) {
              // 确保公司名称包含搜索词（不区分大小写）
              const entityName = apiCompany.EntityName || '';
              const containsSearchTerm = entityName.toLowerCase().includes(searchTermLower);
              
              // 只处理名称中包含搜索词的公司
              if (containsSearchTerm) {
                const savedCompany = await saveCompanyFromAbnLookup(apiCompany);
                if (savedCompany) {
                  savedCompanies.push(savedCompany as unknown as CompanyWithApiFlag);
                }
              } else {
                console.log(`Filtering out API result "${entityName}" as it does not contain "${query}"`);
              }
            }
            
            if (savedCompanies.length > 0) {
              console.log(`Saved ${savedCompanies.length} companies from ABN Lookup API`);
              return NextResponse.json({ 
                companies: savedCompanies,
                message: 'Results retrieved from Australian Business Register.'
              }, { status: 200 });
            }
          }
        }
        
        return NextResponse.json({ companies: [] }, { status: 200 });
      }
      
      console.log(`Found ${snapshot.docs.length} companies`);
      
      // 首先过滤掉不包含搜索词的公司
      let filteredDocs = snapshot.docs;
      
      // 如果这是名称搜索，只保留名称中包含搜索词的公司
      if (isCompanyNameSearch) {
        console.log(`Filtering companies by name containing "${query}"`);
        filteredDocs = snapshot.docs.filter(doc => {
          const data = doc.data();
          // 检查name_en字段
          const nameEn = (data.name_en || '').toLowerCase();
          return nameEn.includes(searchTermLower);
        });
        console.log(`After name filtering: ${filteredDocs.length} companies remain`);
      }
      
      // 获取所有通过过滤的公司 ID
      const companyIds = filteredDocs.map(doc => doc.id);
      
      // 将公司 ID 分成最多 30 个一组的批次
      const batchSize = 30;
      const companyIdBatches: string[][] = [];
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
              address: officeData.address || '',
              city: officeData.city || '',
              state: officeData.state || '',
              country: officeData.country || 'Australia',
              postalCode: officeData.postalCode || '',
              phone: officeData.phone,
              email: officeData.email,
              isHeadquarters: officeData.isHeadquarter || false
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
      let companies = filteredDocs.map(doc => {
        const data = doc.data() as Omit<Company, 'id'>;
        const companyId = doc.id;
        
        return {
          id: companyId,
          ...data,
          // 确保所有必需的字段都有值
          name: data.name || data.name_en || '',
          location: data.location || '',
          teamSize: data.teamSize || '',
          offices: officesByCompany[companyId] || [],
          services: servicesByCompany[companyId] || []
        } as Company;
      });
      
      console.log('Combined all data for companies');
      
      // For company name search, calculate match scores
      let isShortSearch = false;
      let relevantResultsCount = 0;
      let companiesWithScores: Array<{ company: Company, score: number }> = [];
      
      if (isCompanyNameSearch) {
        isShortSearch = query.trim().length <= 2;
        
        // 使用不同的匹配阈值，短搜索词更严格
        const currentMatchThreshold = isShortSearch ? SHORT_SEARCH_MATCH_THRESHOLD : MATCH_THRESHOLD;
        
        // Calculate match scores for relevant filtering
        companiesWithScores = companies.map(company => {
          let score = 0;
          
          // Name match (highest priority)
          if (company.name_en) {
            score = Math.max(score, stringSimilarity(company.name_en.toLowerCase(), searchTermLower));
            
            // 如果公司名称包含短搜索词，额外增加匹配得分
            if (isShortSearch && company.name_en.toLowerCase().includes(searchTermLower)) {
              score += 0.3; // 显著提高包含精确搜索词的匹配度
            }
          }
          
          // Service match (medium priority)
          if (company.services && Array.isArray(company.services)) {
            for (const service of company.services) {
              if (typeof service === 'string') {
                score = Math.max(score, stringSimilarity(service.toLowerCase(), searchTermLower) * 0.7);
              }
            }
          }
          
          // Industry match (medium priority)
          if (company.industry && typeof company.industry === 'string') {
            score = Math.max(score, stringSimilarity(company.industry.toLowerCase(), searchTermLower) * 0.6);
          }
          
          return { company, score };
        });
        
        // Count relevant results (score >= threshold)
        relevantResultsCount = companiesWithScores.filter(item => item.score >= currentMatchThreshold).length;
        console.log(`Found ${relevantResultsCount} relevant results for company name search "${query}" with threshold ${currentMatchThreshold}`);
        
        // Filter and sort by score
        companies = companiesWithScores
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(item => item.company);
          
        // 对于短搜索词，只保留相关性较高的结果
        if (isShortSearch && companies.length > 0) {
          const highlyRelevantCompanies = companiesWithScores
            .filter(item => item.score >= currentMatchThreshold)
            .map(item => item.company);
            
          if (highlyRelevantCompanies.length > 0) {
            console.log(`Using ${highlyRelevantCompanies.length} highly relevant results for short search term "${query}"`);
            companies = highlyRelevantCompanies;
          }
        }
      }
      
      // 应用位置过滤
      if (location) {
        console.log('Applying location filter:', location);
        
        // 将位置参数拆分为多个地区
        const locations = location.split(',').map(loc => loc.trim().toLowerCase());
        console.log('Locations after splitting:', locations);
        
        companies = companies.filter((company: Company) => {
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
            return company.offices.some((office: Office) => {
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
      companies.sort((a: Company, b: Company) => {
        const nameA = (a.name_en || '').toLowerCase();
        const nameB = (b.name_en || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      // Check if need to fetch from ABN Lookup API for company name search
      if (isCompanyNameSearch && 
          (companies.length <= MIN_RESULTS_THRESHOLD || forceApiSearch) && 
          query.trim().length >= MIN_SEARCH_LENGTH) {
        
        if (forceApiSearch) {
          console.log('Force API search requested for company name search');
        } else {
          console.log(`Found only ${companies.length} companies in database (<= ${MIN_RESULTS_THRESHOLD}), trying ABN Lookup API by name`);
        }
        
        try {
          // Get companies from ABN Lookup API by name
          const apiCompanies = await getCompaniesByName(query);
          
          if (apiCompanies && apiCompanies.length > 0) {
            console.log(`Found ${apiCompanies.length} companies from ABN Lookup API`);
            
            // Save each company to database and collect results
            const savedApiCompanies: CompanyWithApiFlag[] = [];
            let pendingApiCompanies: any[] = []; // 存储待处理的API公司
            
            // 首先处理前QUICK_RESPONSE_THRESHOLD个匹配的公司
            let processedCount = 0;
            let matchedCount = 0;
            
            for (const apiCompany of apiCompanies) {
              // 确保公司名称包含搜索词（不区分大小写）
              const entityName = apiCompany.EntityName || '';
              const containsSearchTerm = entityName.toLowerCase().includes(searchTermLower);
              
              if (containsSearchTerm) {
                // 如果已达到快速响应阈值，将剩余公司放入待处理列表
                if (matchedCount >= QUICK_RESPONSE_THRESHOLD) {
                  pendingApiCompanies.push(apiCompany);
                  continue;
                }
                
                const savedCompany = await saveCompanyFromAbnLookup(apiCompany);
                if (savedCompany) {
                  // 标记API来源
                  const apiData = savedCompany as unknown as CompanyWithApiFlag;
                  savedApiCompanies.push(apiData);
                  matchedCount++;
                }
              } else {
                console.log(`Filtering out API result "${entityName}" as it does not contain "${query}"`);
              }
              
              processedCount++;
            }
            
            if (savedApiCompanies.length > 0) {
              console.log(`Initially saved ${savedApiCompanies.length} companies from ABN Lookup API to database`);
              
              // Add API companies to results, avoid duplicates by ABN
              const existingAbns = new Set(companies.map(company => company.abn || '').filter(abn => abn));
              
              for (const apiCompany of savedApiCompanies) {
                if (apiCompany.abn && !existingAbns.has(apiCompany.abn)) {
                  companies.push(apiCompany);
                  existingAbns.add(apiCompany.abn);
                }
              }
              
              // Re-sort combined results
              companies.sort((a: Company, b: Company) => {
                const nameA = (a.name_en || '').toLowerCase();
                const nameB = (b.name_en || '').toLowerCase();
                return nameA.localeCompare(nameB);
              });
              
              // 如果有待处理的公司并且已经至少找到了一些公司，启动后台处理
              if (pendingApiCompanies.length > 0 && savedApiCompanies.length > 0) {
                console.log(`Quick response with ${savedApiCompanies.length} companies, continuing with ${pendingApiCompanies.length} more in background`);
                
                // 在后台处理剩余公司，不阻塞响应
                processPendingCompaniesInBackground(pendingApiCompanies, query, searchTermLower);
                
                // 添加消息表明找到了额外的结果，并且正在后台处理更多
                const responseMessage = `Found ${savedApiCompanies.length} companies from Australian Business Register. Searching for more...`;
                return NextResponse.json({ 
                  companies, 
                  message: responseMessage 
                }, { status: 200 });
              }
              
              // 消息表明所有匹配公司已经处理完毕
              const responseMessage = `Found and saved ${savedApiCompanies.length} additional companies from Australian Business Register.`;
              return NextResponse.json({ 
                companies, 
                message: responseMessage 
              }, { status: 200 });
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
      const includesApiResults = companies.some((c: CompanyWithApiFlag) => c._isFromAbnLookup);
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

/**
 * 在后台处理剩余的公司数据，不阻塞API响应
 * 这个函数会在响应已经发送后继续执行
 */
async function processPendingCompaniesInBackground(
  pendingCompanies: any[], 
  query: string, 
  searchTermLower: string
) {
  try {
    console.log(`Background processing started for ${pendingCompanies.length} pending companies`);
    let savedCount = 0;
    
    for (const apiCompany of pendingCompanies) {
      // 确保公司名称包含搜索词（不区分大小写）
      const entityName = apiCompany.EntityName || '';
      const containsSearchTerm = entityName.toLowerCase().includes(searchTermLower);
      
      if (containsSearchTerm) {
        const savedCompany = await saveCompanyFromAbnLookup(apiCompany);
        if (savedCompany) {
          savedCount++;
          // 每保存5个公司记录一次日志
          if (savedCount % 5 === 0) {
            console.log(`Background processing: saved ${savedCount}/${pendingCompanies.length} companies`);
          }
        }
      }
    }
    
    console.log(`Background processing completed: saved total ${savedCount} additional companies for query "${query}"`);
  } catch (error) {
    console.error('Error in background processing:', error);
  }
} 