"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CompanyCard } from "./CompanyCard";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { SearchParams } from "@/components/search/SearchUtils";
import { Company, Office } from "@/types/company";

export function CompaniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companiesOffices, setCompaniesOffices] = useState<Record<string, Office[]>>({});

  // Parse current search params from URL
  const currentSearchParams: SearchParams = {
    query: searchParams.get('query') || undefined,
    location: searchParams.get('location') || undefined,
    abn: searchParams.get('abn') || undefined,
    industry: searchParams.get('industry') || undefined,
    services: searchParams.getAll('service').length > 0 ? searchParams.getAll('service') : undefined
  };

  // Fetch companies and their offices from API
  useEffect(() => {
    const fetchCompaniesAndOffices = async () => {
      try {
        setIsLoading(true);
        setError(null); // 重置错误状态
        
        // 获取公司列表
        const response = await fetch('/api/companies', {
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

        // 获取所有公司的办公室数据
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
      } catch (err) {
        console.error('Error in fetchCompaniesAndOffices:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompaniesAndOffices();
  }, []);

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

    // Update URL without refreshing the page
    const newUrl = `/companies${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  // 添加获取公司位置的辅助函数
  const getCompanyLocation = (companyId: string, company: Company): string => {
    // 首先尝试使用公司自身的 state 字段
    if (company.state) {
      return company.state.toUpperCase();
    }

    // 如果公司有 offices 数组，使用它
    if (company.offices && company.offices.length > 0) {
      const states = new Set<string>();
      
      // 首先添加总部所在州
      const headquarters = company.offices.find(office => office.isHeadquarter === true);
      if (headquarters?.state) {
        states.add(headquarters.state.toUpperCase());
      }
      
      // 然后添加其他州
      company.offices.forEach(office => {
        if (office.state && !office.isHeadquarter) {
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
          <h1 className="text-3xl font-bold mb-4">Find IT Companies</h1>
          <p className="text-muted-foreground">
            Browse through our curated list of top IT companies across the globe. Filter by services, location, ABN, industry and more to find the perfect match for your project.
          </p>
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
                  ? `${companies.length} companies found`
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

        {/* Companies Listing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {companies.map((company) => {
            // 在这里打印每个公司的数据，用于调试
            console.log('Rendering company:', {
              id: company.id,
              name: company.name_en,
              state: company.state,
              offices: company.offices
            });
            
            return (
              <CompanyCard
                key={company.id}
                id={company.id}
                name_en={company.name_en || company.name || ''}
                logo={company.logo}
                location={getCompanyLocation(company.id, company)}
                description={company.shortDescription}
                verified={typeof company.verified === 'string' ? company.verified === 'true' : !!company.verified}
                teamSize={company.teamSize}
                languages={typeof company.languages === 'string' ? company.languages.split(',') : Array.isArray(company.languages) ? company.languages : []}
                services={company.services || []}
                abn={company.abn}
                industries={company.industries || [company.industry].flat().filter(Boolean)}
                offices={company.offices}
              />
            );
          })}
        </div>

        {/* Pagination - show only if we have enough companies */}
        {companies.length > 10 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <Button variant="outline" size="icon" disabled>
                &lt;
              </Button>
              <Button variant="default" size="sm" className="bg-primary text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <span className="mx-2">...</span>
              <Button variant="outline" size="sm">
                10
              </Button>
              <Button variant="outline" size="icon">
                &gt;
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
