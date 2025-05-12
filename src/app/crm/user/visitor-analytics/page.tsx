"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import {
  Users,
  Clock,
  MapPin,
  ArrowUpRight,
  MousePointer,
} from 'lucide-react';
import Sidebar from '@/components/crm/shared/layout/Sidebar';

// Dynamic import of chart component
const AnalyticsCharts = dynamic(
  () => import('@/components/crm/analytics/AnalyticsCharts'),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading charts...</div>
          </div>
        ))}
      </div>
    ),
  }
);

export default function VisitorAnalytics() {
  const pageData = {
    totalVisits: 1234,
    avgStayTime: '5:30',
    bounceRate: '35',
    mainRegion: 'Shanghai',
    visitChange: '+12.5',
    bounceChange: '+2.1'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Visitor Analytics</h1>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#E4BF2D]/10 rounded-lg">
                  <Users className="text-[#E4BF2D]" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Total Visits</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{pageData.totalVisits}</p>
              <div className="flex items-center gap-2 mt-2">
                <ArrowUpRight className="text-green-500" size={16} />
                <p className="text-green-500 text-sm">{pageData.visitChange}%</p>
                <span className="text-gray-400 text-sm">vs last period</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#E4BF2D]/10 rounded-lg">
                  <Clock className="text-[#E4BF2D]" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Avg. Time</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{pageData.avgStayTime}</p>
              <p className="text-sm text-gray-500 mt-2">minutes/visit</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#E4BF2D]/10 rounded-lg">
                  <MousePointer className="text-[#E4BF2D]" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Bounce Rate</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{pageData.bounceRate}%</p>
              <div className="flex items-center gap-2 mt-2">
                <ArrowUpRight className="text-red-500" size={16} />
                <p className="text-red-500 text-sm">{pageData.bounceChange}%</p>
                <span className="text-gray-400 text-sm">vs last period</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#E4BF2D]/10 rounded-lg">
                  <MapPin className="text-[#E4BF2D]" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Main Region</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{pageData.mainRegion}</p>
              <p className="text-sm text-gray-500 mt-2">25% of total</p>
            </div>
          </div>

          {/* Charts Area */}
          <AnalyticsCharts />
        </div>
      </main>
    </div>
  );
} 