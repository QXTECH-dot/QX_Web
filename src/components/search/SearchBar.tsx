"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Loader2 } from 'lucide-react';
import { getSuggestedSearchTerms, getIndustryAndServiceSuggestions } from './SearchUtils';
import { companiesData } from '@/data/companiesData';
import { isValidABN, cleanABNNumber } from '@/lib/utils';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  placeholder?: string;
  buttonText?: string;
  fullWidth?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
  showLocationField?: boolean;
}

export function SearchBar({
  placeholder = "Search companies, services, industries...",
  buttonText = "Search",
  fullWidth = false,
  className = "",
  onSearch,
  showLocationField = false
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAbnSearch, setIsAbnSearch] = useState(false);
  const [industryServiceQuery, setIndustryServiceQuery] = useState('');
  const [industryServiceSuggestions, setIndustryServiceSuggestions] = useState<string[]>([]);
  const [showIndustryServiceSuggestions, setShowIndustryServiceSuggestions] = useState(false);
  const [selectedIndustryServiceIndex, setSelectedIndustryServiceIndex] = useState(-1);
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 检查输入是否为ABN（延迟执行以减少计算）
  const checkIfAbn = debounce((input: string) => {
    const cleanedInput = cleanABNNumber(input);
    const isAbn = cleanedInput.length === 11;
    setIsAbnSearch(isAbn);
    
    if (isAbn) {
      console.log(`Detected ABN input: ${input} -> ${cleanedInput}`);
    }
  }, 300);

  // 当输入改变时更新并检查ABN
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    checkIfAbn(newValue);
  };

  // 行业/服务输入变化
  const handleIndustryServiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setIndustryServiceQuery(newValue);
    if (newValue.trim().length > 1) {
      const newSuggestions = getIndustryAndServiceSuggestions(newValue);
      setIndustryServiceSuggestions(newSuggestions);
      setShowIndustryServiceSuggestions(newSuggestions.length > 0);
    } else {
      setIndustryServiceSuggestions([]);
      setShowIndustryServiceSuggestions(false);
    }
  };

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update suggestions when query changes
  useEffect(() => {
    if (query.trim().length > 1 && !isAbnSearch) {
      const newSuggestions = getSuggestedSearchTerms(companiesData, query);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, isAbnSearch]);

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : prev));
    }
    // Enter
    else if (e.key === 'Enter') {
      if (selectedSuggestionIndex >= 0) {
        handleSuggestionClick(suggestions[selectedSuggestionIndex]);
      } else {
        handleSearch();
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (query.trim() || industryServiceQuery.trim()) {
      const searchParams = new URLSearchParams();
      const cleanedQuery = cleanABNNumber(query);
      const isAbn = cleanedQuery.length === 11;
      if (isAbn) {
        searchParams.append('abn', cleanedQuery);
        setIsLoading(true);
      } else if (query.trim()) {
        searchParams.append('query', query);
      }
      if (industryServiceQuery.trim()) {
        searchParams.append('industry_service', industryServiceQuery);
      }
      if (location.trim()) {
        searchParams.append('location', location);
      }
      const url = `/companies?${searchParams.toString()}`;
      router.push(url);
      if (isAbn) {
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
      if (onSearch) {
        onSearch(query);
      }
      setShowSuggestions(false);
      setShowIndustryServiceSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSelectedSuggestionIndex(-1);
    setShowSuggestions(false);
    checkIfAbn(suggestion);
  };

  const handleIndustryServiceSuggestionClick = (suggestion: string) => {
    setIndustryServiceQuery(suggestion);
    setSelectedIndustryServiceIndex(-1);
    setShowIndustryServiceSuggestions(false);
  };

  const clearInput = () => {
    setQuery('');
    setSelectedSuggestionIndex(-1);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsAbnSearch(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'max-w-2xl'} ${className}`}>
      <div className={`flex ${showLocationField ? 'flex-col md:flex-row' : ''} gap-4 mb-4`}>
        <div className="relative flex-1 border-2 rounded-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim().length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={isAbnSearch ? "Enter ABN (Australian Business Number)" : placeholder}
            className={`pl-10 h-12 bg-white pr-10 ${isAbnSearch ? 'font-mono text-primary' : ''}`}
            disabled={isLoading}
          />
          {query && !isLoading && (
            <button
              onClick={clearInput}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}

          {isAbnSearch && !isLoading && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2 rounded-full bg-primary text-white text-xs px-2 py-1">
              ABN
            </div>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && !isLoading && !isAbnSearch && (
            <div
              ref={suggestionsRef}
              className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50"
            >
              <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedSuggestionIndex === index ? 'bg-gray-100' : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative flex-1 border-2 rounded-lg">
          <Input
            type="text"
            value={industryServiceQuery}
            onChange={handleIndustryServiceInputChange}
            placeholder="Search industry or service..."
            className="h-12 bg-white"
            disabled={isLoading}
            onFocus={() => industryServiceQuery.trim().length > 1 && industryServiceSuggestions.length > 0 && setShowIndustryServiceSuggestions(true)}
          />
          {showIndustryServiceSuggestions && !isLoading && (
            <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50">
              <ul className="py-1">
                {industryServiceSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedIndustryServiceIndex === index ? 'bg-gray-100' : ''}`}
                    onClick={() => handleIndustryServiceSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedIndustryServiceIndex(index)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {showLocationField && (
          <div className="relative flex-1 border-2 rounded-lg">
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="h-12 bg-white"
              disabled={isLoading}
            />
          </div>
        )}

        <Button
          className={`h-12 px-8 bg-primary text-white ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </div>
      
      {isLoading && (
        <div className="text-sm text-center text-muted-foreground mt-2">
          Searching in the Australian Business Register...
        </div>
      )}

      {isAbnSearch && !isLoading && (
        <div className="text-xs text-center text-muted-foreground mt-2">
          Detected ABN format - will search in business registry
        </div>
      )}
    </div>
  );
}
