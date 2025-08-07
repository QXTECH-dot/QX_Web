"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CompanyCard } from "./CompanyCard";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { searchCompanies, SearchParams } from "@/components/search/SearchUtils";
import { companiesData } from "@/data/companiesData";
import { Company } from "@/types/company";

export function CompaniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Parse current search params from URL
  const currentSearchParams: SearchParams = {
    query: searchParams.get('query') || '',
    location: searchParams.get('location') || '',
    abn: searchParams.get('abn') || '',
    industry: searchParams.get('industry') || '',
    services: searchParams.getAll('service')
  };

  // Function to perform search
  const performSearch = (params: SearchParams) => {
    setIsSearching(true);

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

    // Perform search and update results
    const results = searchCompanies(companiesData, params);
    setSearchResults(results);
    setIsSearching(false);
  };

  // Set initial search results based on URL parameters
  useEffect(() => {
    const hasSearchParams = Object.values(currentSearchParams).some(val =>
      Array.isArray(val) ? val.length > 0 : Boolean(val)
    );

    if (hasSearchParams) {
      performSearch(currentSearchParams);
    } else {
      setSearchResults(companiesData);
    }
  // We're intentionally only running this when the URL search params change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

        {/* Search Results */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {isSearching
              ? "Searching..."
              : searchResults.length > 0
                ? `${searchResults.length} companies found`
                : "No companies found"}
          </h2>
          {searchResults.length === 0 && !isSearching && (
            <p className="text-muted-foreground">
              Try adjusting your search criteria to find more results.
            </p>
          )}
        </div>

        {/* Companies Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {searchResults.map((company) => (
            <CompanyCard
              key={company.id}
              id={company.id}
              name={company.name}
              logo={company.logo}
              location={company.location}
              description={company.description}
              verified={company.verified}
              teamSize={company.teamSize}
              hourlyRate={company.hourlyRate}
              services={company.services}
              abn={company.abn}
              industry={company.industry}
            />
          ))}
        </div>

        {/* Pagination - show only if we have enough companies */}
        {searchResults.length > 10 && (
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
