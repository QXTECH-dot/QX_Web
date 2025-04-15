"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { getSuggestedSearchTerms } from './SearchUtils';
import { companiesData } from '@/data/companiesData';

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
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (query.trim().length > 1) {
      const newSuggestions = getSuggestedSearchTerms(companiesData, query);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

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
    if (query.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.append('query', query);

      if (location.trim()) {
        searchParams.append('location', location);
      }

      // Navigate to search results page
      router.push(`/companies?${searchParams.toString()}`);

      // Call onSearch callback if provided
      if (onSearch) {
        onSearch(query);
      }

      // Hide suggestions
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSelectedSuggestionIndex(-1);
    setShowSuggestions(false);

    // Optional: automatically search when clicking a suggestion
    // setTimeout(handleSearch, 0);
  };

  const clearInput = () => {
    setQuery('');
    setSelectedSuggestionIndex(-1);
    setSuggestions([]);
    setShowSuggestions(false);
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
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-10 h-12 bg-white pr-10"
          />
          {query && (
            <button
              onClick={clearInput}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && (
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

        {showLocationField && (
          <div className="relative flex-1 border-2 rounded-lg">
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="h-12 bg-white"
            />
          </div>
        )}

        <Button
          className="h-12 px-8 bg-primary text-white"
          onClick={handleSearch}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
