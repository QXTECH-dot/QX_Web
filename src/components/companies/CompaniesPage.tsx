"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CompanyCard } from "./CompanyCard";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { SearchParams } from "@/components/search/SearchUtils";
import { Company, Office } from "@/types/company";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { IndustryServicesSearchBar } from "@/components/search/IndustryServicesSearchBar";

// Rows per page
const ROWS_PER_PAGE = 4;
// Companies per row  
const COMPANIES_PER_ROW = 3;
// Companies per page
const COMPANIES_PER_PAGE = ROWS_PER_PAGE * COMPANIES_PER_ROW;
// Items to display per batch (for "Load More" functionality)
const ITEMS_PER_BATCH = 3;

// 计算公司信息丰富度分数
function getCompanyInfoScore(company: Company): number {
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

export function CompaniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companiesOffices, setCompaniesOffices] = useState<Record<string, Office[]>>({});
  const [isFromAbnLookup, setIsFromAbnLookup] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [isSearchingMore, setIsSearchingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(COMPANIES_PER_PAGE);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageParam = searchParams?.get('page');
  
  // Get current page from URL
  useEffect(() => {
    if (currentPageParam) {
      const pageNum = parseInt(currentPageParam, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      } else {
        setCurrentPage(1);
      }
    } else {
      setCurrentPage(1);
    }
  }, [currentPageParam]);
  
  // Calculate pagination data
  const totalPages = Math.ceil(companies.length / COMPANIES_PER_PAGE);
  const startIndex = (currentPage - 1) * COMPANIES_PER_PAGE;
  const endIndex = Math.min(startIndex + visibleCount, companies.length);
  const paginatedCompanies = companies.slice(startIndex, Math.min(startIndex + visibleCount, companies.length));
  const hasMoreResults = endIndex < companies.length;

  // Handle showing more results
  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_BATCH, companies.length - startIndex));
  };

  // Parse current search params from URL
  const currentSearchParams: SearchParams = {
    query: searchParams?.get('query') || undefined,
    location: searchParams?.get('location') || undefined,
    abn: searchParams?.get('abn') || undefined,
    industry: searchParams?.get('industry') || undefined,
    services: (searchParams?.getAll('service') || []).length > 0 ? (searchParams?.getAll('service') || []) : undefined,
    industry_service: searchParams?.get('industry_service') || undefined
  };

  // Handle searching for more companies via API
  const handleSearchMore = async () => {
    if (!currentSearchParams.query) return;
    
    try {
      setIsSearchingMore(true);
      
      // Add a flag to indicate we want to force API search
      const queryParams = new URLSearchParams();
      if (currentSearchParams.query) queryParams.set('query', currentSearchParams.query);
      if (currentSearchParams.location) queryParams.set('location', currentSearchParams.location);
      if (currentSearchParams.abn) queryParams.set('abn', currentSearchParams.abn);
      if (currentSearchParams.industry) queryParams.set('industry', currentSearchParams.industry);
      if (currentSearchParams.services && currentSearchParams.services.length > 0) {
        currentSearchParams.services.forEach(service => queryParams.append('service', service));
      }
      if (currentSearchParams.industry_service) queryParams.set('industry_service', currentSearchParams.industry_service);
      
      // Add a flag to force API search
      queryParams.set('forceApiSearch', 'true');
      
      // Fetch additional results from API
      const response = await fetch('/api/companies?' + queryParams.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch additional companies: ${response.status}`);
      }
      
      const data = await response.json();
      const fetchedCompanies: Company[] = data.data || [];
      
      console.log('🔍 [前端] API响应完整数据:', data);
      console.log('🔍 [前端] 接收到的公司列表:', fetchedCompanies.map(c => ({
        id: c.id,
        name_en: c.name_en,
        name: c.name,
        abn: c.abn
      })));
      
      if (fetchedCompanies.length > 0) {
        // Avoid duplicates by ID
        const existingIds = new Set(companies.map(c => c.id));
        const uniqueNewCompanies = fetchedCompanies.filter(c => !existingIds.has(c.id));
        
        if (uniqueNewCompanies.length > 0) {
          // 在setCompanies前排序
          const cleanedCompanies = uniqueNewCompanies.map(company => {
            if ('_isFromAbnLookup' in company) {
              const cleanCompany = {...company};
              delete (cleanCompany as any)._isFromAbnLookup;
              return cleanCompany;
            }
            return company;
          });
          // 按信息丰富度降序排序
          cleanedCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
          
          // 🔧 前端调试：查看handleSearchMore中的数据
          console.log('🔍 [前端] handleSearchMore接收数据:', cleanedCompanies.map(c => ({
            id: c.id,
            name_en: c.name_en,
            name: c.name,
            abn: c.abn
          })));
          
          setCompanies(prev => [...prev, ...cleanedCompanies]);
          // setApiMessage(data.message || "Additional results found in business registry.");
        } else {
          // setApiMessage("No additional companies found.");
        }
      } else {
        // setApiMessage("No additional companies found.");
      }
    } catch (err) {
      console.error('Error searching for more companies:', err);
      setError(err instanceof Error ? err.message : 'Failed to search for more companies');
    } finally {
      setIsSearchingMore(false);
    }
  };

  const fetchAllOffices = async (fetchedCompanies : Company[]) => {
    //Get all offices data for companies
    if (fetchedCompanies.length > 0) {
      const officesPromises = fetchedCompanies.map(async (company) => {
        try {
          const officesResponse = await fetch(`/api/companies/${company.id}/offices`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!officesResponse.ok) {
            console.error(`Failed to fetch offices for company ${company.id}: ${officesResponse.status}`);
            return { companyId: company.id, offices: [] };
          }
          
          const officesData = await officesResponse.json();
          return {
            companyId: company.id,
            offices: (officesData.offices || []) as Office[]
          };
        } catch (err) {
          console.error(`Error fetching offices for company ${company.id}:`, err);
          return { companyId: company.id, offices: [] };
        }
      });

      try {
        const officesResults = await Promise.all(officesPromises);
        const officesMap = officesResults.reduce((map, item) => {
          map[item.companyId] = item.offices;
          return map;
        }, {} as Record<string, Office[]>);

        setCompaniesOffices(officesMap);
      } catch (err) {
        console.error('Error processing offices data:', err);
        setError('Failed to process offices data');
      }
    }
  }

  // Fetch companies and their offices from API
  useEffect(() => {
    
    const fetchCompaniesAndOffices = async () => {
      try {
        // 🔧 强制清空状态和添加时间戳，防止缓存
        console.log('🔧 [前端] useEffect触发，清空状态，时间戳:', Date.now());
        setCompanies([]);
        setApiMessage(null);
        setError(null);
        setIsFromAbnLookup(false);
        
        setIsLoading(true);
        setError(null); // Reset error state
        setIsFromAbnLookup(false); // Reset ABN Lookup state
        setApiMessage(null); // Reset API message
        setVisibleCount(COMPANIES_PER_PAGE); // Reset visible count
  
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (currentSearchParams.query) queryParams.set('query', currentSearchParams.query);
        if (currentSearchParams.location) queryParams.set('location', currentSearchParams.location);
        if (currentSearchParams.abn) queryParams.set('abn', currentSearchParams.abn);
        if (currentSearchParams.industry) queryParams.set('industry', currentSearchParams.industry);
        if (currentSearchParams.services && currentSearchParams.services.length > 0) {
          currentSearchParams.services.forEach(service => queryParams.append('service', service));
        }
        if (currentSearchParams.industry_service) queryParams.set('industry_service', currentSearchParams.industry_service);
        
        // 🔧 添加时间戳防止缓存
        queryParams.set('_t', Date.now().toString());
        
        // Get company list with query parameters
        const response = await fetch('/api/companies?' + queryParams.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'  // 🔧 禁用缓存
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch companies: ${response.status}`);
        }
        
        const data = await response.json();
        const fetchedCompanies: Company[] = data.data || [];
        
        // 🔧 前端调试：查看实际接收的数据
        console.log('🔍 [前端] API响应完整数据:', data);
        console.log('🔍 [前端] 接收到的公司列表:', fetchedCompanies.map(c => ({
          id: c.id,
          name_en: c.name_en,
          name: c.name,
          abn: c.abn
        })));
        
        // Check if from ABN Lookup
        if (fetchedCompanies.length === 1 && ('_isFromAbnLookup' in fetchedCompanies[0])) {
          setIsFromAbnLookup(true);
          // Remove marker property
          const company = {...fetchedCompanies[0]};
          delete (company as any)._isFromAbnLookup;
          setCompanies([company]);
        } else {
          // Check for companies marked as from ABN Lookup
          const hasApiResults = fetchedCompanies.some(company => '_isFromAbnLookup' in company);
          
          // Clean up _isFromAbnLookup marker
          const cleanedCompanies = fetchedCompanies.map(company => {
            if ('_isFromAbnLookup' in company) {
              const cleanCompany = {...company};
              delete (cleanCompany as any)._isFromAbnLookup;
              return cleanCompany;
            }
            return company;
          });
          
          // 按信息丰富度降序排序
          cleanedCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
          
          // 🔧 前端调试：查看最终设置的公司状态
          console.log('🔍 [前端] 最终设置的companies状态:', cleanedCompanies.map(c => ({
            id: c.id,
            name_en: c.name_en,
            name: c.name,
            abn: c.abn
          })));
          
          setCompanies(cleanedCompanies);
        }
      } catch (err) {
        console.error('Error in fetchCompaniesAndOffices:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompaniesAndOffices();
  }, [
    currentSearchParams.query,
    currentSearchParams.location,
    currentSearchParams.abn,
    currentSearchParams.industry,
    // Convert services array to string for comparison
    currentSearchParams.services,
    currentSearchParams.industry_service
  ]);

  // Function to perform search
  const performSearch = (params: SearchParams) => {
    // 🔧 强制清空状态，防止缓存问题
    console.log('🔧 [前端] 执行新搜索，清空所有状态');
    setCompanies([]);
    setApiMessage(null);
    setError(null);
    setIsFromAbnLookup(false);
    
    // Update URL with search parameters
    const urlParams = new URLSearchParams();
    if (params.query) urlParams.set('query', params.query);
    if (params.location) urlParams.set('location', params.location);
    if (params.abn) urlParams.set('abn', params.abn);
    if (params.industry) urlParams.set('industry', params.industry);
    if (params.services && params.services.length > 0) {
      params.services.forEach(service => urlParams.append('service', service));
    }
    if (params.industry_service) urlParams.set('industry_service', params.industry_service);
    
    // Reset to page 1 when searching
    urlParams.set('page', '1');

    // Update URL without refreshing the page
    const newUrl = `/companies${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    console.log("🔧 [前端] 新搜索URL:",newUrl);
    router.push(newUrl, { scroll: false });
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    // Build new URL parameters
    const urlParams = new URLSearchParams(searchParams?.toString() || '');
    urlParams.set('page', page.toString());
    
    // Update URL
    const newUrl = `/companies?${urlParams.toString()}`;
    router.push(newUrl, { scroll: true });
    
    // Reset visible count when changing pages
    setVisibleCount(COMPANIES_PER_PAGE);
  };

  // Helper function to get company location
  const getCompanyLocation = (companyId: string, company: Company): string => {
    // Use company location field
    if (company.location) {
      return company.location;
    }
    // If company has offices array, use it
    if (company.offices && company.offices.length > 0) {
      const states = new Set<string>();
      // First add headquarters state
      const headquarters = company.offices.find(office => office.isHeadquarters === true);
      if (headquarters?.state) {
        states.add(headquarters.state.toUpperCase());
      }
      // Then add other states
      company.offices.forEach(office => {
        if (office.state && !office.isHeadquarters) {
          states.add(office.state.toUpperCase());
        }
      });
      const statesArray = Array.from(states).sort();
      if (statesArray.length === 0) {
        return 'N/A';
      }
      if (statesArray.length > 3) {
        const remainingCount = statesArray.length - 3;
        return `${statesArray.slice(0, 3).join(', ')} + ${remainingCount} more`;
      }
      return statesArray.join(', ');
    }
    // If none, return N/A
    return 'N/A';
  }

  // Check if we should show "Search More" button - 设置为false，不再显示蓝色按钮
  const isNameSearch = Boolean(currentSearchParams.query && !currentSearchParams.abn);
  const shouldShowSearchMore = false; // 禁用蓝色搜索按钮

  // 在公司数据变化后，批量获取所有公司的offices，并合并到公司对象
  useEffect(() => {
    if (companies.length > 0) {
      (async () => {
        const officesPromises = companies.map(async (company) => {
          try {
            const res = await fetch(`/api/companies/${company.id}/offices`);
            if (!res.ok) return [];
            const data = await res.json();
            return data.offices || [];
          } catch {
            return [];
          }
        });
        const allOffices = await Promise.all(officesPromises);
        setCompanies(companies.map((company, idx) => ({
          ...company,
          offices: allOffices[idx],
        })));
      })();
    }
  }, [companies.length]);

  return (
    <div className="bg-background py-10">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Top Business Service Providers in Australia</h1>
        </div>

        {/* Advanced Search Component */}
        <AdvancedSearch
          onSearch={performSearch}
          initialParams={currentSearchParams}
        />

        {/* ABN Lookup Notification - 已移除
        {isFromAbnLookup && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700 font-medium">
              This company information was retrieved from the Australian Business Register. Some details may be limited.
            </p>
          </div>
        )}
        */}

        {/* API Additional Results Message - 已注释掉，不再显示ABN lookup提示 */}
        {/* {apiMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 font-medium">
              {apiMessage}
            </p>
          </div>
        )}
        */}

        {/* Loading, Error and Search Results */}
        <div className="mb-6">
          {isLoading ? (
            <h2 className="text-xl font-semibold mb-2">Loading companies...</h2>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
          <h2 className="text-xl font-semibold mb-2">
                {companies.length > 0
                  ? `${companies.length} companies found${companies.length > COMPANIES_PER_PAGE ? `, showing ${startIndex + 1}-${endIndex}` : ''}`
                : "No companies found"}
          </h2>
              {companies.length === 0 && (
            <p className="text-muted-foreground">
              Try adjusting your search criteria to find more results.
            </p>
              )}
            </>
          )}
        </div>

        {/* "Search for more" button - 已注释掉，不再显示蓝色搜索按钮 */}
        {/* {shouldShowSearchMore && (
          <div className="mb-6 text-center">
            <Button 
              onClick={handleSearchMore} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSearchingMore}
            >
              {isSearchingMore ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search for more companies in Business Registry
                </>
              )}
            </Button>
          </div>
        )} */}

        {/* Companies Listing - Now showing paginated results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {paginatedCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              id={company.id}
              name_en={company.name_en || ''}
              logo={company.logo || ''}
              location={company.location || 'Location not specified'}
              description={company.shortDescription || company.fullDescription || ''}
              teamSize={company.teamSize?.toString() || ''}
              languages={Array.isArray(company.languages) ? company.languages : (company.languages ? [company.languages] : [])}
              services={Array.isArray(company.services) ? company.services : (company.services ? [company.services] : [])}
              abn={company.abn || ''}
              industries={Array.isArray(company.industry) ? company.industry : (company.industry ? [company.industry] : [])}
              offices={company.offices || []}
              second_industry={company.second_industry || ''}
              third_industry={company.third_industry || ''}
            />
          ))}
        </div>

        {/* "Load More" button for incremental display */}
        {hasMoreResults && (
          <div className="text-center mb-8">
            <Button 
              onClick={handleShowMore}
              variant="outline"
            >
              Load More Results
            </Button>
          </div>
        )}

        {/* Enhanced Pagination */}
        {companies.length > COMPANIES_PER_PAGE && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* First Page */}
              {currentPage > 3 && (
                <Button 
                  variant={currentPage === 1 ? "default" : "outline"} 
                  size="sm" 
                  className={currentPage === 1 ? "bg-primary text-white" : ""}
                  onClick={() => handlePageChange(1)}
                >
                1
              </Button>
              )}
              
              {/* Ellipsis for skipped pages at the beginning */}
              {currentPage > 4 && <span className="mx-1">...</span>}
              
              {/* Page Numbers around current page */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                
                if (totalPages <= 5) {
                  // If we have 5 or fewer pages, show all
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // If we're near the start, show first 5 pages
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // If we're near the end, show last 5 pages
                  pageNum = totalPages - 4 + i;
                } else {
                  // Otherwise show 2 pages before and after current page
                  pageNum = currentPage - 2 + i;
                }
                
                // Only show if page number is valid
                if (pageNum > 0 && pageNum <= totalPages && 
                    // Don't duplicate first/last page buttons
                    !(
                      (pageNum === 1 && currentPage > 3) || 
                      (pageNum === totalPages && currentPage < totalPages - 2)
                    )) {
                  return (
                    <Button 
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"} 
                      size="sm"
                      className={currentPage === pageNum ? "bg-primary text-white" : ""}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
              </Button>
                  );
                }
                return null;
              })}
              
              {/* Ellipsis for skipped pages at the end */}
              {currentPage < totalPages - 3 && <span className="mx-1">...</span>}
              
              {/* Last Page */}
              {currentPage < totalPages - 2 && totalPages > 3 && (
                <Button 
                  variant={currentPage === totalPages ? "default" : "outline"} 
                  size="sm"
                  className={currentPage === totalPages ? "bg-primary text-white" : ""}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
              </Button>
              )}
              
              <Button 
                variant="outline" 
                size="icon" 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
