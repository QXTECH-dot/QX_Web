"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, RefreshCcw, MapPin, BarChart2 } from 'lucide-react';
import { companiesData } from '@/data/companiesData';
import { AustralianMapFilters } from './AustralianMapFilters';
import MapSearch from './MapSearch';
import StateComparisonModal from './StateComparisonModal';
import { generateMapData } from '@/lib/mapDataUtils';
import TimelineChart from './TimelineChart'; // Import the TimelineChart component
import { generateHistoricalData } from '@/lib/timelineDataUtils'; // Fix the import path
import MultiStateComparison from './MultiStateComparison';

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
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [highlightedCompany, setHighlightedCompany] = useState<string | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [mapData, setMapData] = useState<any>({});

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

  // Handler for search results
  const handleSearchResultSelect = (stateId: string, companyId: string) => {
    setSelectedState(stateId);
    setHighlightedCompany(companyId);

    // Find the selected company name for highlighting
    const state = stateData.find(s => s.id === stateId);
    if (state) {
      const company = state.companyData.find((c: any) => c.id === companyId);
      if (company) {
        setHighlightedCompany(company.name);
      }
    }
  };

  // Update state data when industry changes
  useEffect(() => {
    setStateData(calculateCompanyCounts(selectedIndustry));
    setMapData(generateMapData(selectedIndustry));
  }, [selectedIndustry]);

  const handleRetry = () => {
    window.location.reload();
  };

  const resetSelection = () => {
    setSelectedState(null);
    setHighlightedCompany(null);
  };

  return (
    <div className="py-4">
      <div className="mb-6">
        <AustralianMapFilters
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          resetSelection={resetSelection}
        />

        <div className="mt-4">
          <MapSearch
            onResultSelect={handleSearchResultSelect}
            className="max-w-md mx-auto mb-4"
          />
        </div>
      </div>

      {showComparisonModal && (
        <StateComparisonModal
          onClose={() => setShowComparisonModal(false)}
          mapData={mapData}
        />
      )}

      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold">Companies in Australia</h3>
        <p className="text-gray-600 mb-4">Explore businesses across Australian states</p>

        {/* Static map image with highlighted selected state */}
        <div className="relative w-full max-w-2xl mx-auto mb-8">
          <Image
            src="https://ext.same-assets.com/1694792166/australia-map.png"
            alt="Map of Australia"
            width={600}
            height={400}
            className="mx-auto rounded-lg border border-gray-200"
            priority
          />

          {selectedState && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="inline-block px-3 py-1.5 bg-qxnet-100 border border-qxnet rounded-lg text-qxnet-700 font-medium animate-pulse">
                  {stateData.find(s => s.id === selectedState)?.name}
                </span>
              </div>
            </div>
          )}

          {highlightedCompany && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center mt-12">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white shadow-md rounded-full text-sm">
                  <MapPin size={16} className="text-red-500" />
                  {highlightedCompany}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* State cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stateData.map((state) => (
          <div
            key={state.id}
            onClick={() => setSelectedState(state.id === selectedState ? null : state.id)}
            className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
              state.companies > 0 ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
            } ${state.id === selectedState ? 'ring-2 ring-qxnet border-qxnet' : ''}`}
          >
            <h4 className="font-medium mb-2">{state.name}</h4>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mr-2 ${
                  state.companies > 0 ? 'bg-qxnet text-black' : 'bg-gray-200 text-gray-500'
                }`}>
                  {state.companies}
                </span>
                <span className="text-gray-600 text-sm">companies</span>
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
                  {state.companyData.slice(0, 3).map((company: any, index: number) => (
                    <li key={index} className={`truncate ${highlightedCompany === company.name ? 'text-qxnet-700 font-medium' : ''}`}>
                      <Link
                        href={`/company/${company.id}`}
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
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

      {selectedState && stateData.find(s => s.id === selectedState)?.companies > 0 && (
        <div className="mt-6 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{stateData.find(s => s.id === selectedState)?.name} Details</h3>
            <button
              onClick={() => setShowComparisonModal(true)}
              className="flex items-center text-sm bg-qxnet-50 text-qxnet-700 px-3 py-1.5 rounded border border-qxnet-100 hover:bg-qxnet-100 transition-colors"
            >
              <BarChart2 className="h-4 w-4 mr-1.5" />
              Compare with other states
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Top Companies</h4>
              <div className="space-y-2">
                {stateData.find(s => s.id === selectedState)?.companyData.slice(0, 5).map((company: any, index: number) => (
                  <Link
                    key={index}
                    href={`/company/${company.id}`}
                    className={`block p-3 rounded border border-gray-100 hover:border-qxnet-100 hover:bg-qxnet-50 transition-colors ${
                      highlightedCompany === company.name ? 'bg-qxnet-50 border-qxnet-100' : ''
                    }`}
                  >
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-gray-500">{company.location}</div>
                  </Link>
                ))}
              </div>

              <Link
                href={`/state/${selectedState}`}
                className="inline-flex items-center mt-4 text-qxnet-600 hover:text-qxnet-700 transition-colors text-sm"
              >
                View all companies in this state
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Regional Statistics</h4>
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Companies:</span>
                  <span className="font-medium">{stateData.find(s => s.id === selectedState)?.companies}</span>
                </div>
                {mapData[selectedState] && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company Density:</span>
                      <span className="font-medium">{mapData[selectedState].density.toFixed(1)} per 10,000km²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Rate:</span>
                      <span className={`font-medium ${mapData[selectedState].growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {mapData[selectedState].growthRate >= 0 ? '+' : ''}{mapData[selectedState].growthRate.toFixed(1)}%
                      </span>
                    </div>
                  </>
                )}

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <p className="text-xs text-gray-500">Top industries in this region:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-block px-2 py-1 bg-white rounded-full text-xs border border-gray-200">Web Development</span>
                    <span className="inline-block px-2 py-1 bg-white rounded-full text-xs border border-gray-200">Software Engineering</span>
                    <span className="inline-block px-2 py-1 bg-white rounded-full text-xs border border-gray-200">E-commerce</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedState && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Historical Growth Data</h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <TimelineChart
              timelineData={[{
                id: selectedState,
                name: stateData.find(s => s.id === selectedState)?.name || '',
                data: generateHistoricalData(selectedState, 18), // Show last 18 months
                color: selectedState === 'new-south-wales' ? '#3498db' :
                       selectedState === 'victoria' ? '#2ecc71' :
                       selectedState === 'queensland' ? '#f39c12' :
                       selectedState === 'western-australia' ? '#e74c3c' :
                       selectedState === 'south-australia' ? '#9b59b6' :
                       selectedState === 'tasmania' ? '#1abc9c' :
                       selectedState === 'northern-territory' ? '#d35400' :
                       '#34495e'
              }]}
              title={`${stateData.find(s => s.id === selectedState)?.name} Growth Timeline`}
              className="mb-4"
            />
            <div className="text-center mt-4">
              <Link href={`/state/${selectedState}/analytics`} className="inline-flex items-center text-qxnet-600 hover:text-qxnet-700 font-medium">
                View full growth analytics
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Multi-State Comparison Tool</h3>
        <p className="text-gray-600 mb-4">Compare key metrics across different Australian states and territories to identify trends and opportunities.</p>
        <MultiStateComparison
          initialStates={selectedState ? [selectedState] : ['new-south-wales', 'victoria']}
        />
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
