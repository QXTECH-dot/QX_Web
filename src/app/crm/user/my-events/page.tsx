"use client";

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  FileText,
  Star,
  CircleDot
} from 'lucide-react';
import Sidebar from '@/components/crm/shared/layout/Sidebar';

interface Activity {
  id: string;
  type: 'task' | 'publish' | 'release';
  title: string;
  date: string;
  time?: string;
  allDay?: boolean;
}

export default function MyEventsPage() {
  const [currentMonth, setCurrentMonth] = useState('April');
  const [currentYear, setCurrentYear] = useState('2025');
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 3, 8));
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2024', '2025', '2026', '2027'];

  const [activities] = useState<Activity[]>([
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

  // 生成日历数据
  const getDaysInMonth = (month: string, year: string) => {
    const monthIndex = months.indexOf(month);
    const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate();
    const firstDay = new Date(parseInt(year), monthIndex, 1).getDay();
    
    const days = [];
    const previousMonthDays = new Date(parseInt(year), monthIndex, 0).getDate();
    
    // 添加上个月的日期
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: previousMonthDays - i,
        isCurrentMonth: false,
        events: []
      });
    }
    
    // 添加当前月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(parseInt(year), monthIndex, i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayEvents = activities.filter(activity => activity.date === dateStr);
      
      days.push({
        day: i,
        isCurrentMonth: true,
        events: dayEvents.length > 0 ? [`${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}`] : []
      });
    }
    
    // 添加下个月的日期
    const remainingDays = 42 - days.length; // 6 行 x 7 天
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        events: []
      });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth, currentYear);

  const getEventsForSelectedDate = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return activities.filter(activity => activity.date === dateStr);
  };

  const formatSelectedDate = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = weekdays[selectedDate.getDay()];
    const date = selectedDate.getDate();
    const month = months[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64">
        <div className="p-6">
          <div className="flex gap-8">
            {/* 左侧日历部分 */}
            <div className="w-[800px]">
              {/* 日历头部 */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <select 
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(e.target.value)}
                    className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E4BF2D]"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E4BF2D]"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <button className="text-gray-600 hover:text-[#E4BF2D]">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="px-3 py-1.5 text-sm text-[#E4BF2D] hover:bg-[#E4BF2D]/10 rounded">
                    Today
                  </button>
                  <button className="text-gray-600 hover:text-[#E4BF2D]">
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="text-xl font-semibold">
                  {formatSelectedDate()}
                </div>
              </div>

              {/* 操作按钮组 */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FileText size={16} />
                    <span>Task</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Star size={16} />
                    <span>Publish</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <CircleDot size={16} />
                    <span>Release</span>
                  </button>
                </div>
              </div>

              {/* 日历主体 */}
              <div className="bg-white rounded-lg shadow">
                {/* 星期标题 */}
                <div className="grid grid-cols-7 border-b">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="py-2 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

                {/* 日期网格 */}
                <div className="grid grid-cols-7">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[90px] p-2 border-b border-r ${
                        !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                      }`}
                      onClick={() => {
                        if (day.isCurrentMonth) {
                          setSelectedDate(new Date(parseInt(currentYear), months.indexOf(currentMonth), day.day));
                        }
                      }}
                    >
                      <div className="text-sm">{day.day}</div>
                      {day.events.map((event, i) => (
                        <div
                          key={i}
                          className="mt-1 text-xs text-[#E4BF2D]"
                        >
                          {event}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧部分 */}
            <div className="flex-1">
              <div className="space-y-4">
                <h3 className="font-medium">Tasks</h3>
                <div className="space-y-2">
                  {getEventsForSelectedDate()
                    .filter(event => event.type === 'task')
                    .map(event => (
                      <div key={event.id} className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span>{event.title}</span>
                        </div>
                        {event.time && <div className="text-sm text-gray-600 mt-1">{event.time}</div>}
                        {event.allDay && <div className="text-sm text-gray-600 mt-1">All Day</div>}
                      </div>
                    ))}
                </div>

                <h3 className="font-medium">Scheduled Events</h3>
                <div className="space-y-2">
                  {getEventsForSelectedDate()
                    .filter(event => event.type === 'publish')
                    .map(event => (
                      <div key={event.id} className="bg-[#E4BF2D]/10 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-[#E4BF2D]" />
                          <span>{event.title}</span>
                        </div>
                        {event.time && <div className="text-sm text-gray-600 mt-1">{event.time}</div>}
                      </div>
                    ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Releases</h3>
                  {getEventsForSelectedDate()
                    .filter(event => event.type === 'release')
                    .map(event => (
                      <div key={event.id} className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <CircleDot size={16} className="text-green-500" />
                          <span>{event.title}</span>
                        </div>
                        {event.time && <div className="text-sm text-gray-600 mt-1">{event.time}</div>}
                      </div>
                    ))}
                </div>

                {getEventsForSelectedDate().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No events scheduled for this day
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 