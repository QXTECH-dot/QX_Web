"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CompanyCard } from "./CompanyCard";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { SearchParams } from "@/components/search/SearchUtils";
import { Company, Office } from "@/types/company";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 每页显示的行数
const ROWS_PER_PAGE = 4;
// 每行显示的公司数
const COMPANIES_PER_ROW = 3;
// 每页显示的公司数
const COMPANIES_PER_PAGE = ROWS_PER_PAGE * COMPANIES_PER_ROW;

export function CompaniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companiesOffices, setCompaniesOffices] = useState<Record<string, Office[]>>({});

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageParam = searchParams.get('page');
  
  // 从URL获取当前页码
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
  
  // 计算分页相关数据
  const totalPages = Math.ceil(companies.length / COMPANIES_PER_PAGE);
  const startIndex = (currentPage - 1) * COMPANIES_PER_PAGE;
  const endIndex = Math.min(startIndex + COMPANIES_PER_PAGE, companies.length);
  const paginatedCompanies = companies.slice(startIndex, endIndex);

  // Parse current search params from URL
  const currentSearchParams: SearchParams = {
    query: searchParams.get('query') || undefined,
    location: searchParams.get('location') || undefined,
    abn: searchParams.get('abn') || undefined,
    industry: searchParams.get('industry') || undefined,
    services: searchParams.getAll('service').length > 0 ? searchParams.getAll('service') : undefined
  };

  const fetchAllOffices = async (fetchedCompanies : Company[]) => {
    //获取所有公司的办公室数据
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
        setIsLoading(true);
        setError(null); // 重置错误状态
  
        // 构建查询参数
        const queryParams = new URLSearchParams();
        if (currentSearchParams.query) queryParams.set('query', currentSearchParams.query);
        if (currentSearchParams.location) queryParams.set('location', currentSearchParams.location);
        if (currentSearchParams.abn) queryParams.set('abn', currentSearchParams.abn);
        if (currentSearchParams.industry) queryParams.set('industry', currentSearchParams.industry);
        if (currentSearchParams.services && currentSearchParams.services.length > 0) {
          currentSearchParams.services.forEach(service => queryParams.append('service', service));
        }
        
        // 获取公司列表，附带查询参数
        const response = await fetch('/api/companies?' + queryParams.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch companies: ${response.status}`);
        }
        
        const data = await response.json();
        const fetchedCompanies: Company[] = data.companies || [];
        setCompanies(fetchedCompanies);
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
    // 由于 services 是数组，我们将其转为字符串进行比较
    currentSearchParams.services
  ]);

  // Function to perform search
  const performSearch = (params: SearchParams) => {
    // Update URL with search parameters
    const urlParams = new URLSearchParams();
    if (params.query) urlParams.set('query', params.query);
    if (params.location) urlParams.set('location', params.location);
    if (params.abn) urlParams.set('abn', params.abn);
    if (params.industry) urlParams.set('industry', params.industry);
    if (params.services && params.services.length > 0) {
      params.services.forEach(service => urlParams.append('service', service));
    }
    
    // Reset to page 1 when searching
    urlParams.set('page', '1');

    // Update URL without refreshing the page
    const newUrl = `/companies${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    console.log("url search",newUrl);
    router.push(newUrl, { scroll: false });
    setCompanies([])
  };
  
  // 处理页面切换
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    // 构建新的 URL 参数
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('page', page.toString());
    
    // 更新 URL
    const newUrl = `/companies?${urlParams.toString()}`;
    router.push(newUrl, { scroll: true });
  };

  // 添加获取公司位置的辅助函数
  const getCompanyLocation = (companyId: string, company: Company): string => {
    // 使用公司location字段
    if (company.location) {
      return company.location;
    }
    // 如果公司有 offices 数组，使用它
    if (company.offices && company.offices.length > 0) {
      const states = new Set<string>();
      // 首先添加总部所在州
      const headquarters = company.offices.find(office => office.isHeadquarters === true);
      if (headquarters?.state) {
        states.add(headquarters.state.toUpperCase());
      }
      // 然后添加其他州
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
    // 如果都没有，返回 N/A
    return 'N/A';
  }

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

        {/* Companies Listing - Now showing paginated results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {paginatedCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              id={company.id}
              name_en={company.name_en || ''}
              logo={company.logo || ''}
              location={getCompanyLocation(company.id, company) || ''}
              description={company.shortDescription || ''}
              teamSize={company.teamSize || ''}
              languages={company.languages || []}
              services={company.services || []}
              abn={company.abn || ''}
              industries={company.industry ? [company.industry] : []}
              offices={company.offices}
            />
          ))}
        </div>

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
