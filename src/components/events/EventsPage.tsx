"use client";

import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import EventCard from "./EventCard";
import EventCalendarFilters from "./EventCalendarFilters";
import { Event } from "@/types/event";
import { getEventsByMonth, eventsData } from "@/data/eventsData";

const EventsPage: React.FC = () => {
  // Get current date
  const currentDate = new Date();

  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // State for multi-select filters
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // State for events
  const [monthEvents, setMonthEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [realEvents, setRealEvents] = useState<Event[]>([]);

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

    // Filter by states (from multi-select dropdown)
    if (selectedStates.length > 0) {
      filtered = filtered.filter(event => selectedStates.includes(event.location.state));
    }

    // Filter by industries (from multi-select dropdown)
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter(event =>
        event.attendees.some(attendee =>
          selectedIndustries.includes(attendee.industry)
        )
      );
    }

    setFilteredEvents(filtered);
  }, [monthEvents, selectedStates, selectedIndustries]);

  useEffect(() => {
    fetch("/api/events/real")
      .then(res => res.json())
      .then(data => setRealEvents(data));
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Events</h1>

      <div>
        {/* Calendar filter section */}
        <EventCalendarFilters
          selectedStates={selectedStates}
          setSelectedStates={setSelectedStates}
          selectedIndustries={selectedIndustries}
          setSelectedIndustries={setSelectedIndustries}
        />

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
          {/* 分割线和真实数据 */}
          <div className="border-t border-gray-300 my-8"></div>
          <h2 className="text-2xl font-bold mb-4">Eventbrite Real Events</h2>
          <div className="space-y-4">
            {realEvents.length === 0 ? (
              <div className="text-gray-500">No real events found.</div>
            ) : (
              realEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
