import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface IndustryServicesSearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const IndustryServicesSearchBar: React.FC<IndustryServicesSearchBarProps> = ({
  onSearch,
  placeholder = 'Search industry or service...',
  className = '',
  value,
}) => {
  const [query, setQuery] = useState(value ?? '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const abortRef = useRef<AbortController | null>(null);

  // 实时请求后端API，获取建议
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    fetch(`/api/industry-services-options?query=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setSuggestions(data.options || []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [debouncedQuery]);

  // 受控模式：如果外部传入value则同步
  useEffect(() => {
    if (typeof value === 'string' && value !== query) {
      setQuery(value);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      setSelectedIndex(idx => (idx < suggestions.length - 1 ? idx + 1 : idx));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(idx => (idx > 0 ? idx - 1 : idx));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearInput = () => {
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex-1">
        {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" /> */}
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-14 text-lg px-6 py-4 border-2 border-primary focus:ring-2 focus:ring-primary font-medium bg-white pr-10 rounded-md"
        />
        {query && !loading && (
          <button
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50">
            <ul className="py-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <li
                  key={suggestion}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedIndex === idx ? 'bg-gray-100' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 