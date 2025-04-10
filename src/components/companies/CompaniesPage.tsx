"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CompanyCard } from "./CompanyCard";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { SearchParams } from "@/components/search/SearchUtils";
import { Company } from "@/types/company";

export function CompaniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companiesOffices, setCompaniesOffices] = useState<Record<string, any[]>>({});

  // Parse current search params from URL
  const currentSearchParams: SearchParams = {
    query: searchParams.get('query') || undefined,
    location: searchParams.get('location') || undefined,
    abn: searchParams.get('abn') || undefined,
    industry: searchParams.get('industry') || undefined,
    services: searchParams.getAll('service').length > 0 ? searchParams.getAll('service') : undefined
  };

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/companies');
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        const data = await response.json();
        setCompanies(data.companies);

        // 获取所有公司的办公室数据
        const officesPromises = data.companies.map(async (company: any) => {
          try {
            const officesResponse = await fetch(`/api/companies/${company.id}/offices`);
            if (officesResponse.ok) {
              const officesData = await officesResponse.json();
              return { 
                companyId: company.id, 
                offices: officesData.offices 
              };
            }
          } catch (err) {
            console.error(`获取公司 ${company.id} 的办公室数据出错:`, err);
          }
          return { companyId: company.id, offices: [] };
        });
        
        const officesResults = await Promise.all(officesPromises);
        const officesMap = officesResults.reduce((map, item) => {
          map[item.companyId] = item.offices;
          return map;
        }, {} as Record<string, any[]>);
        
        setCompaniesOffices(officesMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
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
  const getCompanyLocation = (companyId: string): string => {
    const offices = companiesOffices[companyId] || [];
    const company = companies.find(c => c.id === companyId);
    
    // 查找总部办公室
    const headquarters = offices.find(office => office.isHeadquarter);
    
    if (headquarters) {
      return `${headquarters.city}, ${headquarters.state}`;
    }
    
    // 如果没有总部，返回第一个办公室的位置
    if (offices.length > 0) {
      return `${offices[0].city}, ${offices[0].state}`;
    }
    
    // 如果没有办公室数据，使用行业作为后备
    return company?.industry || '未知位置';
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
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              id={company.id}
              name={company.name}
              logo={company.logo}
              location={getCompanyLocation(company.id)}
              description={company.shortDescription}
              verified={typeof company.verified === 'string' ? company.verified === 'true' : !!company.verified}
              teamSize={company.teamSize}
              languages={typeof company.languages === 'string' ? company.languages.split(',') : Array.isArray(company.languages) ? company.languages : []}
              services={[]} // Company 不再有 services 字段，使用空数组
              abn={company.abn}
              industries={[company.industry]}
            />
          ))}
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
