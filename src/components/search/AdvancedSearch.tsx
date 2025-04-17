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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search companies, services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSearch}>Search</Button>
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="relative"
          >
            <History className="w-4 h-4 mr-2" />
            History
            {showHistory && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  {searchHistory.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No search history</div>
                  ) : (
                    searchHistory.map((item, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => handleHistoryItemClick(item)}
                      >
                        <div className="font-medium">{item.params.query || 'No query'}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Input
          placeholder="Industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Input
          placeholder="ABN"
          value={abn}
          onChange={(e) => setAbn(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: 'name' | 'rating' | 'relevance') => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search companies by name, service, location..."
              className="pl-10 h-12 bg-white"
            />
          </div>
          <div className="relative">
            <Button
              variant="outline"
              className="h-12 px-4 flex items-center gap-2"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter className="h-5 w-5" />
              Advanced Filters
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-[350px] bg-white rounded-md shadow-lg overflow-hidden z-20 p-4">
                <h3 className="font-bold mb-3">Advanced Search</h3>

                {/* ABN search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">ABN</label>
                  <Input
                    type="text"
                    placeholder="Australian Business Number"
                    value={abn}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAbn(e.target.value)}
                    className="mb-2"
                  />
                </div>

                {/* Industry selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Industry</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Select industry"
                      value={industry}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
                      onClick={() => setShowIndustryMenu(!showIndustryMenu)}
                      className="mb-2"
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowIndustryMenu(!showIndustryMenu)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {showIndustryMenu && (
                      <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg z-50">
                        <ul className="py-1">
                          {industries.map((ind) => (
                            <li
                              key={ind}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectIndustry(ind)}
                            >
                              {ind}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Services selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Services</label>
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => setShowServicesMenu(!showServicesMenu)}
                    >
                      <span>
                        {selectedServices.length === 0
                          ? "Select services"
                          : `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>

                    {showServicesMenu && (
                      <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg z-50">
                        <div className="p-2">
                          {services.map((service) => (
                            <div
                              key={service}
                              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => toggleService(service)}
                            >
                              <div className={`w-5 h-5 rounded border mr-2 flex items-center justify-center ${selectedServices.includes(service) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                {selectedServices.includes(service) && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span>{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input
                    type="text"
                    placeholder="City, Country"
                    value={location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                    className="mb-2"
                  />
                </div>

                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button size="sm" onClick={() => {
                    handleSearch();
                    setShowFilterMenu(false);
                  }}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {(selectedServices.length > 0 || industry || abn || location) && (
          <div className="flex flex-wrap gap-2">
            {abn && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                ABN: {abn}
                <button
                  className="ml-2"
                  onClick={() => setAbn('')}
                  aria-label="Remove ABN filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {industry && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                Industry: {industry}
                <button
                  className="ml-2"
                  onClick={() => setIndustry('')}
                  aria-label="Remove industry filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {location && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                Location: {location}
                <button
                  className="ml-2"
                  onClick={() => setLocation('')}
                  aria-label="Remove location filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {selectedServices.map((service) => (
              <div
                key={service}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
              >
                {service}
                <button
                  className="ml-2"
                  onClick={() => toggleService(service)}
                  aria-label={`Remove ${service} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            <button
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
