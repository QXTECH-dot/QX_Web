"use client";

import React, { useState, useEffect, useRef } from 'react';
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

// Australia states options
const stateOptions = [
  { value: 'NSW', label: 'New South Wales (NSW)' },
  { value: 'VIC', label: 'Victoria (VIC)' },
  { value: 'QLD', label: 'Queensland (QLD)' },
  { value: 'WA', label: 'Western Australia (WA)' },
  { value: 'SA', label: 'South Australia (SA)' },
  { value: 'TAS', label: 'Tasmania (TAS)' },
  { value: 'ACT', label: 'Australian Capital Territory (ACT)' },
  { value: 'NT', label: 'Northern Territory (NT)' },
];

interface AdvancedSearchProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: SearchParams;
}

export function AdvancedSearch({ onSearch, initialParams = {} }: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialParams.query || '');
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialParams.location ? [initialParams.location] : []
  );
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
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // 监听搜索历史变化
  useEffect(() => {
    const handleStorageChange = () => {
      setSearchHistory(getSearchHistory());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const params: SearchParams = {
      query,
      location: selectedLocations.join(','), // 将选中的地区用逗号连接
      industry,
      abn,
      sortBy,
      sortOrder
    };
    onSearch(params);
  };

  const handleHistoryItemClick = (historyItem: typeof searchHistory[0]) => {
    setQuery(historyItem.params.query || '');
    if (historyItem.params.location) {
      setSelectedLocations(historyItem.params.location.split(','));
    } else {
      setSelectedLocations([]);
    }
    setIndustry(historyItem.params.industry || '');
    setAbn(historyItem.params.abn || '');
    setSortBy(historyItem.params.sortBy || 'relevance');
    setSortOrder(historyItem.params.sortOrder || 'desc');
    setShowHistory(false);
    onSearch(historyItem.params);
  };

  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(loc => loc !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
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
    setSelectedLocations([]);
    setAbn('');
    setIndustry('');
    setSelectedServices([]);
  };

  const getLocationDisplayText = () => {
    if (selectedLocations.length === 0) {
      return "All States";
    } else if (selectedLocations.length === 1) {
      const state = stateOptions.find(option => option.value === selectedLocations[0]);
      return state ? state.label : "All States";
    } else if (selectedLocations.length === stateOptions.length) {
      return "All States";
    } else {
      return `${selectedLocations.length} States Selected`;
    }
  };

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
          
          {/* Center: Multi-select State dropdown */}
          <div className="w-full md:w-80 relative" ref={locationDropdownRef}>
            <div 
              className="h-14 text-lg px-6 py-4 border-2 border-primary rounded-md font-medium w-full flex items-center justify-between cursor-pointer bg-white"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            >
              <span className={selectedLocations.length === 0 ? "text-muted-foreground" : ""}>
                {getLocationDisplayText()}
              </span>
              <ChevronDown className="h-5 w-5 opacity-70" />
            </div>
            
            {isLocationDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
                <div className="p-2 border-b border-gray-100">
                  <div 
                    className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      if (selectedLocations.length === stateOptions.length) {
                        setSelectedLocations([]);
                      } else {
                        setSelectedLocations(stateOptions.map(option => option.value));
                      }
                    }}
                  >
                    <div className="w-5 h-5 mr-2 border rounded flex items-center justify-center">
                      {selectedLocations.length === stateOptions.length && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <span>All States</span>
                  </div>
                </div>
                
                <div className="p-2">
                  {stateOptions.map((option) => (
                    <div 
                      key={option.value}
                      className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleLocation(option.value)}
                    >
                      <div className="w-5 h-5 mr-2 border rounded flex items-center justify-center">
                        {selectedLocations.includes(option.value) && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
