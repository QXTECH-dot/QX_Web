"use client";

import React, { useState } from 'react';
import { History, Users, Building2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Star, Eye, UserPlus, UserMinus } from 'lucide-react';
import Sidebar from '@/components/crm/shared/layout/Sidebar';

interface Activity {
  id: string;
  type: 'task' | 'publish' | 'release';
  title: string;
  date: string;
  time?: string;
  allDay?: boolean;
}

export default function ActivitiesPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 8));
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 3, 8));
  
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'task',
      title: 'Project Review Meeting',
      date: '2025-04-08',
      time: '10:00 AM'
    },
    {
      id: '2',
      type: 'publish',
      title: 'Q1 Performance Report',
      date: '2025-04-08',
      time: '14:00 PM'
    },
    {
      id: '3',
      type: 'release',
      title: 'Mobile App Update v2.0',
      date: '2025-04-10',
      time: '11:00 AM'
    },
    {
      id: '4',
      type: 'task',
      title: 'Client Presentation',
      date: '2025-04-15',
      time: '09:30 AM'
    },
    {
      id: '5',
      type: 'publish',
      title: 'New Service Launch',
      date: '2025-04-17',
      time: '13:00 PM'
    },
    {
      id: '6',
      type: 'release',
      title: 'Website Redesign',
      date: '2025-04-22',
      time: '10:00 AM'
    },
    {
      id: '7',
      type: 'task',
      title: 'Team Strategy Workshop',
      date: '2025-04-25',
      allDay: true
    },
    {
      id: '8',
      type: 'publish',
      title: 'Partnership Announcement',
      date: '2025-04-28',
      time: '15:00 PM'
    }
  ]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysArray = [];
    const firstDayOfWeek = firstDay.getDay() || 7; // Convert Sunday (0) to 7
    
    // Add previous month's days
    for (let i = 1; i < firstDayOfWeek; i++) {
      const prevDate = new Date(year, month, 1 - i);
      daysArray.unshift({
        date: prevDate,
        isCurrentMonth: false
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Add next month's days to complete the grid
    const remainingDays = 42 - daysArray.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      daysArray.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return daysArray;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1)));
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task':
        return <CalendarIcon className="text-blue-500" size={16} />;
      case 'publish':
        return <Star className="text-[#E4BF2D]" size={16} />;
      case 'release':
        return <Eye className="text-green-500" size={16} />;
      default:
        return <History className="text-gray-400" size={16} />;
    }
  };

  const formatDate = (date: Date) => {
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return activities.filter(activity => activity.date === dateStr);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <div className="p-8">
          <div className="flex gap-8">
            {/* Calendar Section */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <select 
                    value={months[currentDate.getMonth()]}
                    onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), months.indexOf(e.target.value)))}
                    className="text-lg font-semibold bg-transparent border border-gray-200 rounded-md px-2 py-1"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={currentDate.getFullYear()}
                    onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth()))}
                    className="text-lg font-semibold bg-transparent border border-gray-200 rounded-md px-2 py-1"
                  >
                    {[2023, 2024, 2025].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigateMonth('prev')}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm text-[#E4BF2D] hover:bg-[#E4BF2D]/10 rounded-md"
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => navigateMonth('next')}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {days.map(day => (
                  <div key={day} className="bg-white p-2 text-center text-sm text-gray-600 font-medium">
                    {day}
                  </div>
                ))}
                {getDaysInMonth(currentDate).map((day, index) => {
                  const events = getEventsForDate(day.date);
                  const isSelected = selectedDate.toDateString() === day.date.toDateString();
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day.date)}
                      className={`bg-white p-2 min-h-[80px] cursor-pointer hover:bg-gray-50 ${
                        !day.isCurrentMonth ? 'text-gray-400' : ''
                      } ${isSelected ? 'bg-[#E4BF2D]/10' : ''}`}
                    >
                      <div className="text-right mb-1">{day.date.getDate()}</div>
                      {events.length > 0 && (
                        <div className="text-xs text-[#E4BF2D] bg-[#E4BF2D]/10 rounded px-1 py-0.5 inline-block">
                          {events.length} event{events.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Events Section */}
            <div className="w-96 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">{formatDate(selectedDate)}</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-4 h-4 bg-blue-100 rounded-sm flex items-center justify-center">
                    <CalendarIcon className="text-blue-500" size={14} />
                  </div>
                  <span className="text-sm">Task</span>
                  <div className="w-4 h-4 bg-[#E4BF2D]/10 rounded-sm flex items-center justify-center ml-4">
                    <Star className="text-[#E4BF2D]" size={14} />
                  </div>
                  <span className="text-sm">Publish</span>
                  <div className="w-4 h-4 bg-green-100 rounded-sm flex items-center justify-center ml-4">
                    <Eye className="text-green-500" size={14} />
                  </div>
                  <span className="text-sm">Release</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-600">Tasks</h3>
                  {getEventsForDate(selectedDate)
                    .filter(event => event.type === 'task')
                    .map(event => (
                      <div key={event.id} className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          {getActivityIcon(event.type)}
                          <span>{event.title}</span>
                        </div>
                        {event.time && <div className="text-sm text-gray-600 mt-1">{event.time}</div>}
                        {event.allDay && <div className="text-sm text-gray-600 mt-1">All Day</div>}
                      </div>
                    ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-600">Scheduled Events</h3>
                  {getEventsForDate(selectedDate)
                    .filter(event => event.type === 'publish')
                    .map(event => (
                      <div key={event.id} className="bg-[#E4BF2D]/10 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          {getActivityIcon(event.type)}
                          <span>{event.title}</span>
                        </div>
                        {event.time && <div className="text-sm text-gray-600 mt-1">{event.time}</div>}
                      </div>
                    ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-600">Releases</h3>
                  {getEventsForDate(selectedDate)
                    .filter(event => event.type === 'release')
                    .map(event => (
                      <div key={event.id} className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          {getActivityIcon(event.type)}
                          <span>{event.title}</span>
                        </div>
                        {event.time && <div className="text-sm text-gray-600 mt-1">{event.time}</div>}
                      </div>
                    ))}
                </div>

                {getEventsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No events scheduled for this day
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 