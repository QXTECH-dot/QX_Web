"use client";

import React from "react";
import { CheckIcon, Search } from "lucide-react";
import { eventsData } from "@/data/eventsData";

// Get unique locations and themes from events data
const uniqueLocations = Array.from(
  new Set(eventsData.map((event) => event.location.state))
).sort();

const uniqueThemes = Array.from(
  new Set(eventsData.map((event) => event.theme))
).sort();

interface EventsFiltersProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const EventsFilters: React.FC<EventsFiltersProps> = ({
  selectedLocation,
  setSelectedLocation,
  selectedTheme,
  setSelectedTheme,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-8">
      <h2 className="text-lg font-bold mb-4">Filter Events</h2>

      {/* Search input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location filter */}
        <div>
          <h3 className="font-medium mb-2">Location</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            <div
              className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-qxnet-50 ${
                selectedLocation === "" ? "bg-qxnet-50 text-qxnet-700" : ""
              }`}
              onClick={() => setSelectedLocation("")}
            >
              <div className="w-4 h-4 mr-2">
                {selectedLocation === "" && <CheckIcon className="h-4 w-4 text-qxnet" />}
              </div>
              <span>All Locations</span>
            </div>

            {uniqueLocations.map((location) => (
              <div
                key={location}
                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-qxnet-50 ${
                  selectedLocation === location ? "bg-qxnet-50 text-qxnet-700" : ""
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="w-4 h-4 mr-2">
                  {selectedLocation === location && <CheckIcon className="h-4 w-4 text-qxnet" />}
                </div>
                <span>{location}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Theme filter */}
        <div>
          <h3 className="font-medium mb-2">Event Theme</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            <div
              className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-qxnet-50 ${
                selectedTheme === "" ? "bg-qxnet-50 text-qxnet-700" : ""
              }`}
              onClick={() => setSelectedTheme("")}
            >
              <div className="w-4 h-4 mr-2">
                {selectedTheme === "" && <CheckIcon className="h-4 w-4 text-qxnet" />}
              </div>
              <span>All Themes</span>
            </div>

            {uniqueThemes.map((theme) => (
              <div
                key={theme}
                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-qxnet-50 ${
                  selectedTheme === theme ? "bg-qxnet-50 text-qxnet-700" : ""
                }`}
                onClick={() => setSelectedTheme(theme)}
              >
                <div className="w-4 h-4 mr-2">
                  {selectedTheme === theme && <CheckIcon className="h-4 w-4 text-qxnet" />}
                </div>
                <span>{theme}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset filters button */}
      {(selectedLocation !== "" || selectedTheme !== "" || searchQuery !== "") && (
        <button
          onClick={() => {
            setSelectedLocation("");
            setSelectedTheme("");
            setSearchQuery("");
          }}
          className="mt-5 text-sm text-qxnet hover:text-qxnet-700 underline flex items-center"
        >
          Reset all filters
        </button>
      )}
    </div>
  );
};

export default EventsFilters;
