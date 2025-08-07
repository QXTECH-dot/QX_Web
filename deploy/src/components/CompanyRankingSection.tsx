"use client";

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { companiesData } from '@/data/companiesData';
import Link from 'next/link';

// Define ranking types and their metrics
type RankingType = {
  id: string;
  name: string;
  metric: string;
  description: string;
};

// Define company with metrics for rankings
type CompanyRanking = {
  id: string;
  name: string;
  logo: string;
  value: number; // Metric value
  change?: {
    value: number;
    direction: 'up' | 'down' | 'none';
  };
};

// Define the various ranking types we'll display
const rankingTypes: RankingType[] = [
  {
    id: 'total-margin',
    name: 'Total Margin',
    metric: 'Margin %',
    description: 'Companies ranked by their total margin percentage'
  },
  {
    id: 'active-trading',
    name: 'Active Trading Ranking',
    metric: 'Active Users',
    description: 'Companies ranked by number of active users'
  },
  {
    id: 'total-lots',
    name: 'Total Lots',
    metric: 'Lots',
    description: 'Companies ranked by total number of lots'
  },
  {
    id: 'stop-out',
    name: 'Stop Out',
    metric: 'Stop Out %',
    description: 'Companies ranked by stop out levels'
  },
  {
    id: 'profit-order',
    name: 'Profit Order',
    metric: 'Win rate %',
    description: 'Companies ranked by profit order ratio'
  },
  {
    id: 'brokers-profitability',
    name: 'Brokers\' Profitability',
    metric: 'Total Profits',
    description: 'Companies ranked by total profitability'
  },
  {
    id: 'new-user',
    name: 'New User',
    metric: 'New Users',
    description: 'Companies ranked by new user acquisition'
  },
  {
    id: 'spread',
    name: 'Spread',
    metric: 'Avg Spread',
    description: 'Companies ranked by average spread'
  }
];

// Generate demo company data with metrics for each ranking type
const generateCompanyRankings = (): Record<string, CompanyRanking[]> => {
  // Use real companies from companiesData with synthetic metrics
  const baseCompanies = companiesData
    .slice(0, 15)
    .map(company => ({
      id: company.id,
      name: company.name,
      logo: company.logo
    }));

  // Demo companies for additional data if needed
  const demoCompanies = [
    { id: 'fxpro', name: 'FxPro', logo: 'https://ext.same-assets.com/3273624843/3218314263.png' },
    { id: 'fxcm', name: 'FXCM', logo: 'https://ext.same-assets.com/3273624843/1822484193.png' },
    { id: 'pepperstone', name: 'Pepperstone', logo: 'https://ext.same-assets.com/3273624843/1192082462.png' },
    { id: 'fisg', name: 'FISG', logo: 'https://ext.same-assets.com/3273624843/3218314263.png' },
    { id: 'wetrade', name: 'WeTrade', logo: 'https://ext.same-assets.com/3273624843/1822484193.png' },
    { id: 'fbs', name: 'FBS', logo: 'https://ext.same-assets.com/3273624843/1192082462.png' },
    { id: 'zfx', name: 'ZFX', logo: 'https://ext.same-assets.com/3273624843/3218314263.png' },
    { id: 'xm', name: 'XM', logo: 'https://ext.same-assets.com/3273624843/1822484193.png' },
    { id: 'kvb-prime', name: 'KVB PRIME', logo: 'https://ext.same-assets.com/3273624843/1192082462.png' },
    { id: 'startrade', name: 'STARTRADE', logo: 'https://ext.same-assets.com/3273624843/3218314263.png' },
    { id: 'doo-prime', name: 'Doo Prime', logo: 'https://ext.same-assets.com/3273624843/1822484193.png' },
    { id: 'gmi', name: 'GMI', logo: 'https://ext.same-assets.com/3273624843/1192082462.png' },
    { id: 'vt-markets', name: 'VT Markets', logo: 'https://ext.same-assets.com/3273624843/3218314263.png' },
    { id: 'ic-markets', name: 'IC Markets', logo: 'https://ext.same-assets.com/3273624843/1822484193.png' },
  ];

  // Use combination of real and demo companies
  const allCompanies = [...baseCompanies, ...demoCompanies];

  const result: Record<string, CompanyRanking[]> = {};

  // Generate rankings for each type with appropriate metric values
  rankingTypes.forEach(rankingType => {
    // Shuffle and take first 10 companies
    const shuffled = [...allCompanies]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    // Assign randomized metrics based on ranking type
    result[rankingType.id] = shuffled.map((company, index) => {
      let value: number;
      let change;

      switch (rankingType.id) {
        case 'stop-out':
          value = parseFloat((Math.random() * 15).toFixed(2));
          change = {
            value: Math.floor(Math.random() * 40),
            direction: Math.random() > 0.5 ? 'up' : 'down'
          };
          break;
        case 'profit-order':
          value = parseFloat((Math.random() * 5).toFixed(2));
          break;
        case 'brokers-profitability':
          value = parseFloat((Math.random() * 20).toFixed(2));
          change = {
            value: Math.floor(Math.random() * 40),
            direction: Math.random() > 0.5 ? 'up' : 'down'
          };
          break;
        default:
          value = parseFloat((Math.random() * 10).toFixed(2));
          change = {
            value: Math.floor(Math.random() * 40),
            direction: Math.random() > 0.5 ? 'up' : 'down'
          };
      }

      return {
        ...company,
        value,
        change
      };
    })
    // Sort by value in descending order to get rankings
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Limit to top 5
  });

  // Special case for exact data matching the image
  result['stop-out'] = [
    { id: 'fxpro', name: 'FxPro', logo: 'https://ext.same-assets.com/3273624843/3218314263.png', value: 14.59, change: { value: 16, direction: 'up' } },
    { id: 'fxcm', name: 'FXCM', logo: 'https://ext.same-assets.com/3273624843/1822484193.png', value: 6.19, change: { value: 2, direction: 'up' } },
    { id: 'pepperstone', name: 'Pepperstone', logo: 'https://ext.same-assets.com/3273624843/1192082462.png', value: 3.41, change: { value: 31, direction: 'up' } },
    { id: 'fisg', name: 'FISG', logo: 'https://ext.same-assets.com/3273624843/3218314263.png', value: 2.25, change: { value: 14, direction: 'up' } },
    { id: 'wetrade', name: 'WeTrade', logo: 'https://ext.same-assets.com/3273624843/1822484193.png', value: 2.25, change: { value: 27, direction: 'up' } },
  ];

  result['profit-order'] = [
    { id: 'fbs', name: 'FBS', logo: 'https://ext.same-assets.com/3273624843/1192082462.png', value: 4.36, change: { value: 0, direction: 'none' } },
    { id: 'zfx', name: 'ZFX', logo: 'https://ext.same-assets.com/3273624843/3218314263.png', value: 4.29, change: { value: 0, direction: 'none' } },
    { id: 'xm', name: 'XM', logo: 'https://ext.same-assets.com/3273624843/1822484193.png', value: 4.25, change: { value: 0, direction: 'none' } },
    { id: 'kvb-prime', name: 'KVB PRIME', logo: 'https://ext.same-assets.com/3273624843/1192082462.png', value: 4.11, change: { value: 10, direction: 'up' } },
    { id: 'pepperstone', name: 'Pepperstone', logo: 'https://ext.same-assets.com/3273624843/3218314263.png', value: 0.84, change: { value: 3, direction: 'up' } },
  ];

  result['brokers-profitability'] = [
    { id: 'startrade', name: 'STARTRADE', logo: 'https://ext.same-assets.com/3273624843/3218314263.png', value: 17.85, change: { value: 0, direction: 'none' } },
    { id: 'doo-prime', name: 'Doo Prime', logo: 'https://ext.same-assets.com/3273624843/1822484193.png', value: 11.71, change: { value: 0, direction: 'none' } },
    { id: 'gmi', name: 'GMI', logo: 'https://ext.same-assets.com/3273624843/1192082462.png', value: 4.30, change: { value: 2, direction: 'up' } },
    { id: 'vt-markets', name: 'VT Markets', logo: 'https://ext.same-assets.com/3273624843/3218314263.png', value: 3.03, change: { value: 1, direction: 'down' } },
    { id: 'ic-markets', name: 'IC Markets', logo: 'https://ext.same-assets.com/3273624843/1822484193.png', value: 2.35, change: { value: 37, direction: 'up' } },
  ];

  return result;
};

const rankingData = generateCompanyRankings();

// Time filter options
const timeFilters = [
  { id: '30days', label: '30 days' },
  { id: '90days', label: '90 days' },
  { id: '6months', label: '6 months' },
];

export function CompanyRankingSection() {
  const [activeRankingIndex, setActiveRankingIndex] = useState(0);
  const [visibleRankings, setVisibleRankings] = useState<RankingType[]>(rankingTypes.slice(0, 3));
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<Record<string, string>>({
    'stop-out': '30days',
    'profit-order': '30days',
    'brokers-profitability': '30days',
  });

  // Navigate between ranking types
  const handlePrev = () => {
    if (activeRankingIndex === 0) return;

    const newIndex = activeRankingIndex - 1;
    setActiveRankingIndex(newIndex);

    // Update visible rankings
    if (newIndex + 2 < rankingTypes.length) {
      setVisibleRankings(rankingTypes.slice(newIndex, newIndex + 3));
    }
  };

  const handleNext = () => {
    if (activeRankingIndex + 3 >= rankingTypes.length) return;

    const newIndex = activeRankingIndex + 1;
    setActiveRankingIndex(newIndex);

    // Update visible rankings
    setVisibleRankings(rankingTypes.slice(newIndex, newIndex + 3));
  };

  // Handle time filter selection
  const handleTimeFilterChange = (rankingId: string, filterId: string) => {
    setSelectedTimeFilter({
      ...selectedTimeFilter,
      [rankingId]: filterId
    });
  };

  // Format value for display
  const formatValue = (value: number): string => {
    return value.toFixed(2);
  };

  return (
    <section className="py-10 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Rankings</h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={activeRankingIndex === 0}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeRankingIndex + 3 >= rankingTypes.length}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Ranking tabs */}
        <div className="relative border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {rankingTypes.map((ranking, index) => (
              <button
                key={ranking.id}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium ${
                  visibleRankings.some(r => r.id === ranking.id)
                    ? 'text-gray-900'
                    : 'text-gray-500'
                } ${
                  visibleRankings[0]?.id === ranking.id
                    ? 'border-b-2 border-gray-900 font-semibold'
                    : ''
                }`}
                onClick={() => {
                  setActiveRankingIndex(index);
                  setVisibleRankings(rankingTypes.slice(
                    Math.max(0, index),
                    Math.min(rankingTypes.length, index + 3)
                  ));
                }}
              >
                {ranking.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ranking content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {visibleRankings.map((ranking) => (
            <div key={ranking.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold">{ranking.name}</h3>
              </div>

              {/* Time filter tabs */}
              <div className="flex border-b border-gray-100">
                {timeFilters.map(filter => (
                  <button
                    key={filter.id}
                    className={`flex-1 py-3 text-sm font-medium ${
                      selectedTimeFilter[ranking.id] === filter.id
                        ? 'bg-gray-50 text-gray-900'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => handleTimeFilterChange(ranking.id, filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Column headers */}
              <div className="flex text-xs text-gray-500 px-4 py-2 border-b border-gray-100">
                <div className="w-1/2">Brokerage</div>
                <div className="w-1/3 text-right">{ranking.metric}</div>
                <div className="w-1/6 text-right">Ranking</div>
              </div>

              {/* Company rankings */}
              <div className="divide-y divide-gray-100">
                {rankingData[ranking.id]?.map((company, idx) => (
                  <div key={company.id} className="flex items-center px-4 py-3 hover:bg-gray-50">
                    <div className="w-8 h-8 flex-shrink-0 bg-amber-50 rounded-md flex items-center justify-center text-amber-900 mr-3 font-semibold">
                      {idx + 1}
                    </div>
                    <div className="flex items-center w-1/2">
                      <div className="w-6 h-6 mr-2 rounded flex-shrink-0 overflow-hidden">
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-medium text-sm truncate">{company.name}</span>
                    </div>
                    <div className="w-1/3 text-right font-medium">
                      {formatValue(company.value)}
                    </div>
                    <div className="w-1/6 text-right">
                      {company.change?.direction === 'up' && company.change.value > 0 && (
                        <span className="inline-flex items-center text-green-600 text-xs">
                          {company.change.value} <TrendingUp className="h-3 w-3 ml-1" />
                        </span>
                      )}
                      {company.change?.direction === 'down' && company.change.value > 0 && (
                        <span className="inline-flex items-center text-red-600 text-xs">
                          {company.change.value} <TrendingDown className="h-3 w-3 ml-1" />
                        </span>
                      )}
                      {(company.change?.direction === 'none' || !company.change || company.change.value === 0) && (
                        <span className="text-gray-400">--</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
