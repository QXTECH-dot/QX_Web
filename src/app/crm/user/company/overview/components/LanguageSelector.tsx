"use client";

import React, { useState, useEffect, useRef } from "react";
import { languageOptions } from "../constants";
import { LanguageSelectorProps } from "../types";

export function LanguageSelector({
  selectedLanguages,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const toggleLanguage = (langCode: string) => {
    const newSelection = selectedLanguages.includes(langCode)
      ? selectedLanguages.filter((code) => code !== langCode)
      : [...selectedLanguages, langCode];

    onLanguageChange(newSelection);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full border rounded px-3 py-2 bg-white cursor-pointer min-h-[40px] flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedLanguages.length > 0 ? (
            selectedLanguages.map((langCode, index) => {
              const lang = languageOptions.find((l) => l.value === langCode);
              return (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {lang ? lang.label : langCode}
                  <button
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLanguage(langCode);
                    }}
                  >
                    ×
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-gray-500">Select languages...</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {languageOptions.map((lang) => (
            <div
              key={lang.value}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                selectedLanguages.includes(lang.value)
                  ? "bg-blue-50 text-blue-700"
                  : ""
              }`}
              onClick={() => toggleLanguage(lang.value)}
            >
              <span>{lang.label}</span>
              {selectedLanguages.includes(lang.value) && (
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
