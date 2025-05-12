"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Event } from "@/types/event";
import { getEventsByDay } from "@/data/eventsData";

interface CalendarProps {
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
  events: Event[];
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  currentYear,
  onMonthChange,
  events
}) => {
  // Generate calendar dates
  const generateCalendarDates = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Previous month days
    const prevMonthDays = [];
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = new Date(prevMonthYear, currentMonth, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      prevMonthDays.push({
        day: daysInPrevMonth - i,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false
      });
    }

    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true
      });
    }

    // Next month days
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays = [];

    for (let i = 1; i <= 42 - totalDays; i++) {
      nextMonthDays.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const calendarDates = generateCalendarDates();

  // Function to get events for a specific day
  const getEventsForDay = (day: number, month: number, year: number) => {
    return getEventsByDay(day, month, year);
  };

  // Handle month change
  const goToPrevMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    onMonthChange(newMonth, newYear);
  };

  const goToNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    onMonthChange(newMonth, newYear);
  };

  return (
    <div className="w-full mb-10">
      {/* Calendar header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToPrevMonth}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-qxnet-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button
          onClick={goToNextMonth}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-qxnet-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDates.map((date, index) => {
          const dayEvents = getEventsForDay(date.day, date.month, date.year);
          const isToday =
            new Date().getDate() === date.day &&
            new Date().getMonth() === date.month &&
            new Date().getFullYear() === date.year;

          return (
            <div
              key={`${date.year}-${date.month}-${date.day}-${index}`}
              className={`
                border rounded-md p-2 h-24 transition-colors
                ${date.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${isToday ? 'border-qxnet' : 'border-gray-200'}
              `}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`
                    text-sm font-medium
                    ${date.isCurrentMonth ? '' : 'text-gray-400'}
                    ${isToday ? 'bg-qxnet text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
                  `}
                >
                  {date.day}
                </span>
              </div>

              {/* Event logos */}
              <div className="mt-1 flex flex-wrap gap-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="relative" title={event.title}>
                    <Image
                      src={event.organizer.logo}
                      alt={event.organizer.name}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-xs text-gray-500">+{dayEvents.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
