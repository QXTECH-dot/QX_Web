'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Search, Check } from 'lucide-react';

// Comprehensive language database
const LANGUAGES = [
  // Top international languages
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { code: 'zh-hk', name: 'Chinese (Cantonese)', flag: '🇭🇰' },
  { code: 'zh-tw', name: 'Chinese (Traditional)', flag: '🇹🇼' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  
  // Asian languages
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'tl', name: 'Filipino/Tagalog', flag: '🇵🇭' },
  { code: 'my', name: 'Myanmar (Burmese)', flag: '🇲🇲' },
  { code: 'km', name: 'Khmer (Cambodian)', flag: '🇰🇭' },
  { code: 'lo', name: 'Lao', flag: '🇱🇦' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'fa', name: 'Persian (Farsi)', flag: '🇮🇷' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  
  // European languages
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸' },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹' },
  
  // African languages
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
  { code: 'xh', name: 'Xhosa', flag: '🇿🇦' },
  
  // Other languages
  { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'ga', name: 'Irish', flag: '🇮🇪' },
  { code: 'gd', name: 'Scottish Gaelic', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'eu', name: 'Basque', flag: '🇪🇸' },
  { code: 'ca', name: 'Catalan', flag: '🇪🇸' },
  { code: 'gl', name: 'Galician', flag: '🇪🇸' },
];

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
  placeholder?: string;
  maxHeight?: string;
}

export default function LanguageSelector({
  selectedLanguages = [],
  onChange,
  placeholder = "Select languages...",
  maxHeight = "200px"
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter languages based on search term
  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleLanguageToggle = (languageName: string) => {
    const newLanguages = selectedLanguages.includes(languageName)
      ? selectedLanguages.filter(lang => lang !== languageName)
      : [...selectedLanguages, languageName];
    
    onChange(newLanguages);
  };

  const removeLanguage = (languageName: string) => {
    onChange(selectedLanguages.filter(lang => lang !== languageName));
  };

  const getLanguageByName = (name: string) => {
    return LANGUAGES.find(lang => lang.name === name);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Languages Display */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-300 rounded-md bg-white">
          {selectedLanguages.length === 0 ? (
            <span className="text-gray-500 text-sm self-center">{placeholder}</span>
          ) : (
            selectedLanguages.map((langName) => {
              const lang = getLanguageByName(langName);
              return (
                <div
                  key={langName}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                >
                  <span className="text-base">{lang?.flag}</span>
                  <span className="font-medium">{langName}</span>
                  <button
                    type="button"
                    onClick={() => removeLanguage(langName)}
                    className="text-primary hover:text-red-600 ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-primary border border-dashed border-gray-300 hover:border-primary rounded-md text-sm transition-colors"
          >
            <Plus size={14} />
            Add Language
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredLanguages.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                No languages found matching "{searchTerm}"
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = selectedLanguages.includes(lang.name);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageToggle(lang.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-primary/5 text-primary' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-xs text-gray-500 uppercase">{lang.code}</span>
                    </div>
                    {isSelected && (
                      <Check size={16} className="text-primary" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
            {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
          </div>
        </div>
      )}
    </div>
  );
}