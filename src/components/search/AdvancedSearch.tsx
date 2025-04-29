"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Filter, Search, X, History } from 'lucide-react';
import { SearchParams } from './SearchUtils';
import { getSearchHistory } from '@/services/searchHistory';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Common industry categories
const industries = [
  "Agriculture, Forestry and Fishing",
  "Mining",
  "Manufacturing",
  "Electricity, Gas, Water and Waste Services",
  "Construction",
  "Wholesale Trade",
  "Retail Trade",
  "Accommodation and Food Services",
  "Transport, Postal and Warehousing",
  "Information Media and Telecommunications",
  "Financial and Insurance Services",
  "Rental, Hiring and Real Estate Services",
  "Professional, Scientific and Technical Services",
  "Administrative and Support Services",
  "Public Administration and Safety",
  "Education and Training",
  "Health Care and Social Assistance",
  "Arts and Recreation Services",
  "Other Services"
];

// Common services
const services = [
  "Web Development",
  "Mobile App Development",
  "E-Commerce Development",
  "UI/UX Design",
  "Cloud Solutions",
  "SEO",
  "PPC",
  "Social Media Marketing",
  "Content Marketing",
  "Cybersecurity Consulting",
  "Data Analytics",
  "Logo Design"
];

interface AdvancedSearchProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: SearchParams;
}

export function AdvancedSearch({ onSearch, initialParams = {} }: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialParams.query || '');
  const [location, setLocation] = useState(initialParams.location || '');
  const [industry, setIndustry] = useState(initialParams.industry || '');
  const [abn, setAbn] = useState(initialParams.abn || '');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'relevance'>(initialParams.sortBy || 'relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialParams.sortOrder || 'desc');
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState(getSearchHistory());
  const [selectedServices, setSelectedServices] = useState<string[]>(initialParams.services || []);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [showIndustryMenu, setShowIndustryMenu] = useState(false);

  // 监听搜索历史变化
  useEffect(() => {
    const handleStorageChange = () => {
      setSearchHistory(getSearchHistory());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSearch = () => {
    const params: SearchParams = {
      query,
      location,
      industry,
      abn,
      sortBy,
      sortOrder
    };
    onSearch(params);
  };

  const handleHistoryItemClick = (historyItem: typeof searchHistory[0]) => {
    setQuery(historyItem.params.query || '');
    setLocation(historyItem.params.location || '');
    setIndustry(historyItem.params.industry || '');
    setAbn(historyItem.params.abn || '');
    setSortBy(historyItem.params.sortBy || 'relevance');
    setSortOrder(historyItem.params.sortOrder || 'desc');
    setShowHistory(false);
    onSearch(historyItem.params);
  };

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const selectIndustry = (industry: string) => {
    setIndustry(industry);
    setShowIndustryMenu(false);
  };

  const clearFilters = () => {
    setQuery('');
    setLocation('');
    setAbn('');
    setIndustry('');
    setSelectedServices([]);
  };

  // 澳洲各州选项
  const stateOptions = [
    { value: 'all', label: 'All States' },
    { value: 'ACT', label: 'Australian Capital Territory (ACT)' },
    { value: 'NSW', label: 'New South Wales (NSW)' },
    { value: 'NT', label: 'Northern Territory (NT)' },
    { value: 'QLD', label: 'Queensland (QLD)' },
    { value: 'SA', label: 'South Australia (SA)' },
    { value: 'TAS', label: 'Tasmania (TAS)' },
    { value: 'VIC', label: 'Victoria (VIC)' },
    { value: 'WA', label: 'Western Australia (WA)' },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center w-full">
          {/* Left: Company/ABN/Industry input */}
          <div className="flex-1 w-full">
            <Input
              placeholder="Company name, ABN, industry..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="min-w-[220px] h-14 text-lg px-6 py-4 border-2 border-primary focus:ring-2 focus:ring-primary font-medium"
            />
          </div>
          {/* Center: State input 改为下拉菜单 */}
          <div className="w-full md:w-80">
            <Select value={location || 'all'} onValueChange={val => setLocation(val === 'all' ? '' : val)}>
              <SelectTrigger className="h-14 text-lg px-6 py-4 border-2 border-primary focus:ring-2 focus:ring-primary font-medium w-full">
                <SelectValue placeholder="State (region)" />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Right: Search button */}
          <div className="w-full md:w-auto flex-shrink-0">
            <Button className="w-full md:w-auto h-14 text-lg px-8 font-bold flex items-center justify-center" onClick={handleSearch}>
              <Search className="w-5 h-5 mr-3" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
