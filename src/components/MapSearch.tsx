import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { getCompanySearchResults } from '@/lib/mapDataUtils';

interface MapSearchProps {
  onResultSelect: (stateId: string, companyId: string) => void;
  className?: string;
}

export default function MapSearch({ onResultSelect, className = '' }: MapSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Update search results when search term changes
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = getCompanySearchResults(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle selecting a search result
  const handleResultClick = (stateId: string, companyId: string, companyName: string) => {
    onResultSelect(stateId, companyId);
    setSearchTerm(companyName);
    setIsSearchFocused(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div
      ref={searchRef}
      className={`relative z-20 ${className}`}
    >
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          placeholder="Search for companies..."
          className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isSearchFocused && searchResults.length > 0 && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 text-xs text-gray-500 border-b">
            Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          </div>

          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result.stateId, result.id, result.name)}
              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-sm">{result.name}</div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <span className="mr-1">{result.location}</span>
                {result.rating && (
                  <span className="inline-flex items-center bg-qxnet-50 text-qxnet-700 px-1.5 rounded text-xs ml-2">
                    {result.rating} ★
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isSearchFocused && searchTerm.length >= 2 && searchResults.length === 0 && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          <p className="text-gray-500">No companies found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
