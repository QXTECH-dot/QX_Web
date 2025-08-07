"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, RefreshCcw } from 'lucide-react';
import { companiesData } from '@/data/companiesData';
import { AustralianMapFilters } from './AustralianMapFilters';

// Types for component props
interface AustralianMapFallbackProps {
  selectedIndustry?: string;
  setSelectedIndustry?: (industry: string) => void;
}

// A fallback that displays a static map of Australia with clickable regions
export function AustralianMapFallback({
  selectedIndustry = 'all',
  setSelectedIndustry = () => {}
}: AustralianMapFallbackProps) {
  const [stateData, setStateData] = useState<any[]>([]);

  // Calculate company counts based on actual companiesData
  const calculateCompanyCounts = (industry: string) => {
    const counts = {
      "new-south-wales": { count: 0, companies: [] },
      "victoria": { count: 0, companies: [] },
      "queensland": { count: 0, companies: [] },
      "western-australia": { count: 0, companies: [] },
      "south-australia": { count: 0, companies: [] },
      "australian-capital-territory": { count: 0, companies: [] },
      "tasmania": { count: 0, companies: [] },
      "northern-territory": { count: 0, companies: [] }
    };

    companiesData.forEach(company => {
      // Skip if we're filtering by industry and this company doesn't match
      if (industry !== 'all') {
        const matchesIndustry = company.services && company.services.some((service: string) =>
          service.toLowerCase().includes(industry.replace("-", " "))
        );
        if (!matchesIndustry) return;
      }

      const location = company.location;
      if (location.includes("Sydney") || location.includes("New South Wales")) {
        counts["new-south-wales"].count++;
        counts["new-south-wales"].companies.push(company);
      } else if (location.includes("Melbourne") || location.includes("Victoria")) {
        counts["victoria"].count++;
        counts["victoria"].companies.push(company);
      } else if (location.includes("Brisbane") || location.includes("Queensland")) {
        counts["queensland"].count++;
        counts["queensland"].companies.push(company);
      } else if (location.includes("Perth") || location.includes("Western Australia")) {
        counts["western-australia"].count++;
        counts["western-australia"].companies.push(company);
      } else if (location.includes("Adelaide") || location.includes("South Australia")) {
        counts["south-australia"].count++;
        counts["south-australia"].companies.push(company);
      } else if (location.includes("Hobart") || location.includes("Tasmania")) {
        counts["tasmania"].count++;
        counts["tasmania"].companies.push(company);
      } else if (location.includes("Darwin") || location.includes("Northern Territory")) {
        counts["northern-territory"].count++;
        counts["northern-territory"].companies.push(company);
      } else if (location.includes("Canberra") || location.includes("ACT") || location.includes("Australian Capital Territory")) {
        counts["australian-capital-territory"].count++;
        counts["australian-capital-territory"].companies.push(company);
      }
    });

    return [
      { id: "new-south-wales", name: "New South Wales", companies: counts["new-south-wales"].count, companyData: counts["new-south-wales"].companies },
      { id: "victoria", name: "Victoria", companies: counts["victoria"].count, companyData: counts["victoria"].companies },
      { id: "queensland", name: "Queensland", companies: counts["queensland"].count, companyData: counts["queensland"].companies },
      { id: "western-australia", name: "Western Australia", companies: counts["western-australia"].count, companyData: counts["western-australia"].companies },
      { id: "south-australia", name: "South Australia", companies: counts["south-australia"].count, companyData: counts["south-australia"].companies },
      { id: "australian-capital-territory", name: "Australian Capital Territory", companies: counts["australian-capital-territory"].count, companyData: counts["australian-capital-territory"].companies },
      { id: "tasmania", name: "Tasmania", companies: counts["tasmania"].count, companyData: counts["tasmania"].companies },
      { id: "northern-territory", name: "Northern Territory", companies: counts["northern-territory"].count, companyData: counts["northern-territory"].companies }
    ];
  };

  // Update state data when industry changes
  useEffect(() => {
    setStateData(calculateCompanyCounts(selectedIndustry));
  }, [selectedIndustry]);

  const handleRetry = () => {
    window.location.reload();
  };

  const resetSelection = () => {
    // Nothing to reset in the fallback
  };

  return (
    <div className="py-6">
      <AustralianMapFilters
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        resetSelection={resetSelection}
      />

      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold">Companies in Australia</h3>
        <p className="text-gray-600 mb-4">Explore businesses across Australian states</p>

        {/* Static map image */}
        <div className="relative w-full max-w-2xl mx-auto mb-8">
          <Image
            src="https://ext.same-assets.com/1694792166/australia-map.png"
            alt="Map of Australia"
            width={600}
            height={400}
            className="mx-auto rounded-lg border border-gray-200"
            priority
          />
        </div>
      </div>

      {/* State cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stateData.map((state) => (
          <div
            key={state.id}
            className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
              state.companies > 0 ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
            }`}
          >
            <h4 className="font-medium mb-2">{state.name}</h4>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mr-2 ${
                  state.companies > 0 ? 'bg-qxnet text-black' : 'bg-gray-200 text-gray-500'
                }`}>
                  {state.companies}
                </span>
                <span className="text-gray-500 text-sm">companies</span>
              </div>
              {state.companies > 0 ? (
                <Link
                  href={`/state/${state.id}?industry=${selectedIndustry !== 'all' ? selectedIndustry : ''}`}
                  className="inline-flex items-center text-qxnet-600 hover:text-qxnet-700 transition-colors group text-sm"
                >
                  View <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <span className="text-xs text-gray-400">No results</span>
              )}
            </div>

            {/* Show top companies if available */}
            {state.companies > 0 && state.companyData && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Top companies:</p>
                <ul className="text-xs space-y-1">
                  {state.companyData.slice(0, 2).map((company: any, index: number) => (
                    <li key={index} className="truncate">
                      <Link href={`/company/${company.id}`} className="hover:underline">
                        {company.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-3">
          The interactive map is currently unavailable. Using static listing instead.
        </p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-qxnet text-black rounded-md hover:bg-qxnet-600 transition-colors"
        >
          <RefreshCcw className="h-4 w-4" />
          Try loading interactive map
        </button>
      </div>
    </div>
  );
}
