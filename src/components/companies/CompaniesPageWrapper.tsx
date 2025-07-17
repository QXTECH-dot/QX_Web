"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CompanyCard } from "./CompanyCard";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { SearchParams } from "@/components/search/SearchUtils";
import { Company } from "@/types/company";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const COMPANIES_PER_PAGE = 12;

// Calculate company info score (same as backend logic)
function getCompanyInfoScore(company: Company): number {
  let score = 0;
  if (company.logo) score += 1;
  if (company.description || company.shortDescription || company.fullDescription) score += 1;
  if (company.services && company.services.length > 0) score += Math.min(company.services.length, 3);
  if (company.languages && company.languages.length > 0) score += 1;
  if (company.offices && company.offices.length > 0) score += 1;
  if (company.website) score += 1;
  if (company.abn) score += 1;
  if (company.industry && company.industry.length > 0) score += 1;
  if (company.verified) score += 1;
  return score;
}

interface CompaniesPageWrapperProps {
  initialCompanies: Company[];
  initialTotalCount: number;
  initialTotalPages: number;
  initialPage: number;
  searchParams: {
    industry?: string;
    state?: string;
    location?: string;
    query?: string;
    search?: string;
    abn?: string;
    page?: string;
  };
}

export function CompaniesPageWrapper({
  initialCompanies,
  initialTotalCount,
  initialTotalPages,
  initialPage,
  searchParams: initialSearchParams
}: CompaniesPageWrapperProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Use SSR data as initial state
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromAbnLookup, setIsFromAbnLookup] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [isSearchingMore, setIsSearchingMore] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  
  const currentPageParam = searchParams?.get('page');
  
  // Update page from URL
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
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    router.push(`/companies?${params.toString()}`);
  };

  // Execute search
  const performSearch = (params: SearchParams) => {
    console.log('🔧 [前端] 执行新搜索，清空所有状态');
    setCompanies([]);
    setApiMessage(null);
    setError(null);
    setIsFromAbnLookup(false);
    
    // Build URL parameters
    const urlParams = new URLSearchParams();
    if (params.query) urlParams.set('query', params.query);
    if (params.location) urlParams.set('location', params.location);
    if (params.abn) urlParams.set('abn', params.abn);
    if (params.industry) urlParams.set('industry', params.industry);
    if (params.services && params.services.length > 0) {
      params.services.forEach(service => urlParams.append('service', service));
    }
    if (params.industry_service) urlParams.set('industry_service', params.industry_service);
    
    // Reset to first page when searching
    urlParams.set('page', '1');

    // Update URL
    const newUrl = `/companies${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    console.log("🔧 [前端] 新搜索URL:", newUrl);
    router.push(newUrl, { scroll: false });
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
      
      const queryParams = new URLSearchParams();
      if (currentSearchParams.query) queryParams.set('query', currentSearchParams.query);
      if (currentSearchParams.location) queryParams.set('location', currentSearchParams.location);
      if (currentSearchParams.abn) queryParams.set('abn', currentSearchParams.abn);
      if (currentSearchParams.industry) queryParams.set('industry', currentSearchParams.industry);
      if (currentSearchParams.services && currentSearchParams.services.length > 0) {
        currentSearchParams.services.forEach(service => queryParams.append('service', service));
      }
      if (currentSearchParams.industry_service) queryParams.set('industry_service', currentSearchParams.industry_service);
      
      queryParams.set('forceApiSearch', 'true');
      
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
      
      if (fetchedCompanies.length > 0) {
        const existingIds = new Set(companies.map(c => c.id));
        const uniqueNewCompanies = fetchedCompanies.filter(c => !existingIds.has(c.id));
        
        if (uniqueNewCompanies.length > 0) {
          const cleanedCompanies = uniqueNewCompanies.map(company => {
            if ('_isFromAbnLookup' in company) {
              const cleanCompany = {...company};
              delete (cleanCompany as any)._isFromAbnLookup;
              return cleanCompany;
            }
            return company;
          });
          
          cleanedCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
          setCompanies(prev => [...prev, ...cleanedCompanies]);
        }
      }
    } catch (err) {
      console.error('Error searching for more companies:', err);
      setError(err instanceof Error ? err.message : 'Failed to search for more companies');
    } finally {
      setIsSearchingMore(false);
    }
  };

  // Fetch companies when search params change (but not on initial load)
  useEffect(() => {
    // Skip if this is the initial load with SSR data
    if (companies.length > 0 && companies === initialCompanies) {
      return;
    }

    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsFromAbnLookup(false);
        setApiMessage(null);

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
        
        queryParams.set('page', currentPage.toString());
        queryParams.set('pageSize', COMPANIES_PER_PAGE.toString());
        queryParams.set('_t', Date.now().toString());
        
        const response = await fetch('/api/companies?' + queryParams.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch companies: ${response.status}`);
        }
        
        const data = await response.json();
        const fetchedCompanies: Company[] = data.data || [];
        
        setTotalCount(data.total || 0);
        setTotalPages(data.totalPages || 1);
        
        if (fetchedCompanies.length === 1 && ('_isFromAbnLookup' in fetchedCompanies[0])) {
          setIsFromAbnLookup(true);
          const company = {...fetchedCompanies[0]};
          delete (company as any)._isFromAbnLookup;
          setCompanies([company]);
        } else {
          const cleanedCompanies = fetchedCompanies.map(company => {
            if ('_isFromAbnLookup' in company) {
              const cleanCompany = {...company};
              delete (cleanCompany as any)._isFromAbnLookup;
              return cleanCompany;
            }
            return company;
          });
          
          cleanedCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
          setCompanies(cleanedCompanies);
        }
      } catch (err) {
        console.error('Error in fetchCompanies:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [
    currentSearchParams.query,
    currentSearchParams.location,
    currentSearchParams.abn,
    currentSearchParams.industry,
    currentSearchParams.services,
    currentSearchParams.industry_service,
    currentPage
  ]);

  // Fetch offices for companies
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

  // Generate pagination
  const renderPagination = () => {
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              onClick={() => handlePageChange(1)}
              className={currentPage === 1 ? "bg-primary text-primary-foreground" : ""}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map(page => (
          <Button
            key={page}
            variant="outline"
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              onClick={() => handlePageChange(totalPages)}
              className={currentPage === totalPages ? "bg-primary text-primary-foreground" : ""}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Top Business Service Providers in Australia</h1>
          <AdvancedSearch
            onSearch={performSearch}
            initialParams={currentSearchParams}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          {isLoading ? (
            <p className="text-muted-foreground">Loading companies...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                {totalCount} companies found, showing {((currentPage - 1) * COMPANIES_PER_PAGE) + 1}-{Math.min(currentPage * COMPANIES_PER_PAGE, totalCount)}
              </p>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>

        {/* API Message */}
        {apiMessage && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{apiMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              id={company.id}
              slug={company.slug}
              name_en={company.name_en || company.name || ''}
              logo={company.logo || ''}
              location={company.location || 'Location not specified'}
              description={company.shortDescription || company.fullDescription || ''}
              teamSize={company.teamSize?.toString() || ''}
              languages={Array.isArray(company.languages) ? company.languages : (company.languages ? [company.languages] : [])}
              services={Array.isArray(company.services) ? 
                company.services.map(service => typeof service === 'string' ? service : service.title || '') :
                (company.services ? [typeof company.services === 'string' ? company.services : ''] : [])}
              abn={company.abn || ''}
              industries={Array.isArray(company.industry) ? company.industry : (company.industry ? [company.industry] : [])}
              offices={company.offices || []}
              second_industry={company.second_industry || ''}
              third_industry={company.third_industry || ''}
            />
          ))}
        </div>

        {/* Search More Button */}
        {currentSearchParams.query && !isFromAbnLookup && (
          <div className="text-center mb-8">
            <Button 
              onClick={handleSearchMore}
              disabled={isSearchingMore}
              variant="outline"
              className="flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              {isSearchingMore ? 'Searching...' : 'Search More in Business Registry'}
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && renderPagination()}

        {/* No Results */}
        {!isLoading && companies.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No companies found matching your criteria.</p>
            <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}