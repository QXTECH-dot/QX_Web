"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckIcon, ChevronDown, ChevronUp, X } from "lucide-react";
import { eventsData } from "@/data/eventsData";

// Get unique states from event data
const allAustralianStates = [
  "NSW", "VIC", "QLD", "ACT",
  "WA", "SA", "TAS", "NT"
];

const uniqueStates = Array.from(
  new Set([
    ...allAustralianStates,
    ...eventsData.map((event) => event.location.state)
  ])
).sort((a, b) => {
  const order = { NSW: 1, VIC: 2, QLD: 3, ACT: 4 };
  if (order[a as keyof typeof order] && order[b as keyof typeof order]) {
    return order[a as keyof typeof order] - order[b as keyof typeof order];
  }
  if (order[a as keyof typeof order]) return -1;
  if (order[b as keyof typeof order]) return 1;
  return a.localeCompare(b);
});

// Get unique industries from attendees data
// Since the Event type doesn't have an industry field directly,
// we'll gather industries from attendees
const uniqueIndustries = Array.from(
  new Set(
    eventsData.flatMap((event) =>
      event.attendees.map((attendee) => attendee.industry)
    )
  )
).sort();

interface MultiSelectDropdownProps {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
  placeholder: string;
  label: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
  placeholder,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOptions(selectedOptions.filter(item => item !== option));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOptions([]);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className="border border-gray-300 rounded-md p-2 flex items-center min-h-[42px] cursor-pointer hover:border-qxnet"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map(option => (
              <div
                key={option}
                className="bg-qxnet-50 text-qxnet-700 px-2 py-1 rounded-md text-sm flex items-center"
              >
                {option}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer hover:text-qxnet-900"
                  onClick={(e) => removeOption(option, e)}
                />
              </div>
            ))}
            {selectedOptions.length > 0 && (
              <button
                className="text-gray-500 text-xs hover:text-qxnet ml-2"
                onClick={(e) => clearAll(e)}
              >
                Clear
              </button>
            )}
          </div>
        )}
        <div className="ml-auto">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1 max-h-60 overflow-y-auto">
          {options.map(option => (
            <div
              key={option}
              className={`flex items-center px-3 py-2 hover:bg-qxnet-50 cursor-pointer ${
                selectedOptions.includes(option) ? "bg-qxnet-50" : ""
              }`}
              onClick={() => toggleOption(option)}
            >
              <div className="w-5 h-5 mr-2 border rounded flex items-center justify-center border-gray-300">
                {selectedOptions.includes(option) && (
                  <CheckIcon className="h-4 w-4 text-qxnet" />
                )}
              </div>
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface EventCalendarFiltersProps {
  selectedStates: string[];
  setSelectedStates: (states: string[]) => void;
  selectedIndustries: string[];
  setSelectedIndustries: (industries: string[]) => void;
}

const EventCalendarFilters: React.FC<EventCalendarFiltersProps> = ({
  selectedStates,
  setSelectedStates,
  selectedIndustries,
  setSelectedIndustries
}) => {
  return (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MultiSelectDropdown
          options={uniqueStates}
          selectedOptions={selectedStates}
          setSelectedOptions={setSelectedStates}
          placeholder="Select states..."
          label="Filter by State"
        />

        <MultiSelectDropdown
          options={uniqueIndustries}
          selectedOptions={selectedIndustries}
          setSelectedOptions={setSelectedIndustries}
          placeholder="Select industries..."
          label="Filter by Industry"
        />
      </div>

      {(selectedStates.length > 0 || selectedIndustries.length > 0) && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setSelectedStates([]);
              setSelectedIndustries([]);
            }}
            className="text-sm text-qxnet hover:text-qxnet-700 underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCalendarFilters;
