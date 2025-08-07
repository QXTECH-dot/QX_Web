"use client";

import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import EventCard from "./EventCard";
import EventsFilters from "./EventsFilters";
import { Event } from "@/types/event";
import { getEventsByMonth, eventsData } from "@/data/eventsData";

const EventsPage: React.FC = () => {
  // Get current date
  const currentDate = new Date();

  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // State for filtering
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // State for events
  const [monthEvents, setMonthEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // Handle month change
  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Update events when selected month changes
  useEffect(() => {
    // Get events for the selected month
    const events = getEventsByMonth(selectedMonth, selectedYear);
    setMonthEvents(events);
  }, [selectedMonth, selectedYear]);

  // Apply filters to events
  useEffect(() => {
    let filtered = [...monthEvents];

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(event => event.location.state === selectedLocation);
    }

    // Filter by theme
    if (selectedTheme) {
      filtered = filtered.filter(event => event.theme === selectedTheme);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.organizer.name.toLowerCase().includes(query) ||
        event.summary.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(filtered);
  }, [monthEvents, selectedLocation, selectedTheme, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Events</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <EventsFilters
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Calendar and events list */}
        <div className="lg:col-span-3">
          {/* Calendar section */}
          <div className="bg-qxnet-50 p-6 rounded-lg mb-10">
            <Calendar
              currentMonth={selectedMonth}
              currentYear={selectedYear}
              onMonthChange={handleMonthChange}
              events={monthEvents}
            />
          </div>

          {/* Events list section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
              <span>
                Events in {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} {selectedYear}
              </span>
              <span className="text-sm font-normal text-gray-500">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </span>
            </h2>

            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-500">No events found with the selected filters.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or selecting a different month.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
