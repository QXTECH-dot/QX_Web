import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { getCompanyByAbn, getCompaniesByName, saveCompanyFromAbnLookup } from '@/lib/abnLookup';

// Calculate company info score (logo gets high priority)
function getCompanyInfoScore(company: any): number {
  let score = 0;
  
  // Logo gets a very high base score to ensure companies with logos rank first
  if (company.logo) {
    score += 100; // High base score for having a logo
  }
  
  // Other factors add smaller incremental scores
  if (company.description || company.shortDescription || company.fullDescription) score += 10;
  if (company.services && company.services.length > 0) score += Math.min(company.services.length * 3, 15); // Max 15 for services
  if (company.languages && company.languages.length > 0) score += 5;
  if (company.offices && company.offices.length > 0) score += 5;
  if (company.website) score += 10;
  if (company.abn) score += 5;
  if (company.industry && company.industry.length > 0) score += 5;
  if (company.verified) score += 10;
  
  return score;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const state = searchParams.get('state');
    const location = searchParams.get('location');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const search = searchParams.get('search') || searchParams.get('query') || searchParams.get('abn');
    const services = searchParams.get('services');
    const industry_service = searchParams.get('industry_service');

    console.log('API请求参数:', { industry, state, location, page, pageSize, search, services, industry_service });

    // Get all companies with simple query
    const snapshot = await firestore.collection('companies').get();
    let allCompanies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply filters in memory
    if (industry && industry !== 'all') {
      allCompanies = allCompanies.filter(company => {
        const companyIndustries = Array.isArray(company.industry) ? company.industry : [company.industry];
        return companyIndustries.includes(industry);
      });
    }

    if (state && state !== 'all') {
      allCompanies = allCompanies.filter(company => company.state === state);
    }

    if (location && location !== 'all') {
      allCompanies = allCompanies.filter(company => {
        const targetState = location.toUpperCase();
        
        // 1. 检查公司的offices数据
        const companyOffices = company.offices || [];
        const hasOfficeInState = companyOffices.some((office: any) => 
          office.state && office.state.toUpperCase() === targetState
        );
        
        if (hasOfficeInState) {
          return true;
        }
        
        // 2. 检查公司本身的state字段
        if (company.state && company.state.toUpperCase() === targetState) {
          return true;
        }
        
        // 3. 检查公司的location字段（可能包含州信息）
        if (company.location) {
          const locationText = company.location.toUpperCase();
          // 检查是否包含州名或州代码
          const stateMapping: { [key: string]: string[] } = {
            'NSW': ['NSW', 'NEW SOUTH WALES'],
            'VIC': ['VIC', 'VICTORIA'],
            'QLD': ['QLD', 'QUEENSLAND'],
            'WA': ['WA', 'WESTERN AUSTRALIA'],
            'SA': ['SA', 'SOUTH AUSTRALIA'],
            'TAS': ['TAS', 'TASMANIA'],
            'ACT': ['ACT', 'AUSTRALIAN CAPITAL TERRITORY', 'CANBERRA'],
            'NT': ['NT', 'NORTHERN TERRITORY']
          };
          
          const stateVariants = stateMapping[targetState] || [targetState];
          if (stateVariants.some(variant => locationText.includes(variant))) {
            return true;
          }
        }
        
        return false;
      });
    }

    if (services && services !== 'all') {
      const servicesArray = services.split(',').map(s => s.trim()).filter(s => s);
      allCompanies = allCompanies.filter(company => {
        const companyServices = (company.services || []).map((service: any) => service.title || service);
        return servicesArray.some(service => 
          companyServices.some((companyService: string) => 
            companyService.toLowerCase().includes(service.toLowerCase())
          )
        );
      });
    }

    // Apply search filter
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      allCompanies = allCompanies.filter((company: any) => {
        const nameMatch = company.name?.toLowerCase().includes(searchTerm);
        const nameEnMatch = company.name_en?.toLowerCase().includes(searchTerm);
        const descMatch = company.description?.toLowerCase().includes(searchTerm);
        const locationMatch = company.location?.toLowerCase().includes(searchTerm);
        const abnMatch = company.abn?.includes(searchTerm);
        
        return nameMatch || nameEnMatch || descMatch || locationMatch || abnMatch;
      });
    }

    // Apply industry_service filter (独立的行业/服务搜索)
    if (industry_service && industry_service.trim()) {
      const keyword = industry_service.toLowerCase().trim();
      allCompanies = allCompanies.filter((company: any) => {
        // 检查行业字段
        const industryMatch = [
          company.industry_1,
          company.industry_2, 
          company.industry_3,
          company.industry
        ].some(field => {
          if (!field) return false;
          const fieldStr = Array.isArray(field) ? field.join(' ') : String(field);
          return fieldStr.toLowerCase().includes(keyword);
        });
        
        // 检查服务字段
        const servicesMatch = (company.services || []).some((service: any) => {
          const serviceTitle = typeof service === 'string' ? service : service.title || '';
          return serviceTitle.toLowerCase().includes(keyword);
        });
        
        return industryMatch || servicesMatch;
      });
    }

    // Sort by info score
    allCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));

    // Pagination
    const totalCount = allCompanies.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const companies = allCompanies.slice(startIndex, endIndex);

    const totalPages = Math.ceil(totalCount / pageSize);
    const processingTime = Date.now() - startTime;

    // ABN Lookup functionality - if no results found and there's a search query
    if (companies.length === 0 && search && search.trim()) {
      console.log('[ABN Lookup] No results found, starting ABN lookup');
      
      try {
        let abnResults: any[] = [];
        const searchTerm = search.trim();
        
        // Check if it's an ABN search (11 digits)
        const isAbnSearch = /^\d{11}$/.test(searchTerm.replace(/[^0-9]/g, ''));
        
        if (isAbnSearch) {
          // ABN search
          console.log(`[ABN Lookup] ABN search: ${searchTerm}`);
          const cleanAbn = searchTerm.replace(/[^0-9]/g, '');
          const abnData = await getCompanyByAbn(cleanAbn);
          
          if (abnData) {
            const savedCompany = await saveCompanyFromAbnLookup(abnData);
            if (savedCompany) {
              abnResults = [savedCompany];
              console.log('[ABN Lookup] ABN lookup successful');
            }
          }
        } else if (searchTerm.length >= 3) {
          // Company name search
          console.log(`[ABN Lookup] Company name search: ${searchTerm}`);
          const nameResults = await getCompaniesByName(searchTerm);
          
          if (nameResults && nameResults.length > 0) {
            console.log(`[ABN Lookup] Found ${nameResults.length} matching companies`);
            
            // Process up to 12 companies for the first page
            const companiesToProcess = nameResults.slice(0, 12);
            const savePromises = companiesToProcess.map(async (companyData) => {
              try {
                const savedCompany = await saveCompanyFromAbnLookup(companyData);
                return savedCompany;
              } catch (error) {
                console.error(`[ABN Lookup] Error saving company: ${companyData.EntityName}`, error);
                return null;
              }
            });
            
            const savedResults = await Promise.all(savePromises);
            abnResults = savedResults.filter(result => result !== null);
            
            console.log(`[ABN Lookup] Successfully saved ${abnResults.length}/${companiesToProcess.length} companies`);
          }
        }
        
        if (abnResults.length > 0) {
          companies = abnResults;
          totalCount = abnResults.length;
          
          console.log(`[ABN Lookup] Returning ${abnResults.length} companies from ABN lookup`);
          
          return NextResponse.json({
            success: true,
            data: companies,
            total: totalCount,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            message: `Found ${abnResults.length} ${abnResults.length === 1 ? 'company' : 'companies'} in Australian Business Register and added to our database.`,
            filters: { industry, state, location, search, services, industry_service },
            processingTime: Date.now() - startTime
          });
        }
      } catch (error) {
        console.error('[ABN Lookup] Error during ABN lookup:', error);
        // Continue with empty results if ABN lookup fails
      }
    }

    console.log(`返回 ${companies.length} 家公司，总共 ${totalCount} 家，处理时间: ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      data: companies,
      total: totalCount,
      page: page,
      pageSize: pageSize,
      totalPages: totalPages,
      filters: { industry, state, location, search, services, industry_service },
      processingTime
    });

  } catch (error) {
    console.error('获取公司数据失败:', error);
    
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      data: [],
      processingTime
    }, { status: 500 });
  }
}