"use client";

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Calendar } from 'lucide-react';

// Dynamic import of Chart.js components
const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { ssr: false }
);

const Bar = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Bar),
  { ssr: false }
);

const Pie = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Pie),
  { ssr: false }
);

// Dynamic import of Chart.js
const initChartJs = async () => {
  const { Chart: ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } = await import('chart.js');
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );
};

export default function AnalyticsCharts() {
  const [isChartReady, setIsChartReady] = useState(false);
  const [timeRange, setTimeRange] = useState('daily');
  const [selectedMetric, setSelectedMetric] = useState('visitors');

  useEffect(() => {
    initChartJs().then(() => setIsChartReady(true));
  }, []);

  // Visitor data
  const visitorsData = {
    labels: timeRange === 'daily' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : timeRange === 'monthly'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      : ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: selectedMetric === 'visitors' ? 'Visitors' : 'Page Views',
        data: timeRange === 'daily'
          ? [65, 59, 80, 81, 56, 55, 40]
          : timeRange === 'monthly'
          ? [120, 150, 180, 220, 250, 280]
          : [450, 520, 580, 620],
        fill: false,
        borderColor: '#E4BF2D',
        backgroundColor: 'rgba(228, 191, 45, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#E4BF2D',
      },
    ],
  };

  // Traffic source data
  const sourceData = {
    labels: ['Search Engines', 'Direct Access', 'Social Media', 'External Links', 'Others'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(228, 191, 45, 0.8)',
          'rgba(228, 191, 45, 0.6)',
          'rgba(228, 191, 45, 0.4)',
          'rgba(228, 191, 45, 0.3)',
          'rgba(228, 191, 45, 0.2)',
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  // User behavior path data
  const pathData = {
    labels: ['Homepage', 'Company Details', 'Services', 'Contact', 'Conversion'],
    datasets: [
      {
        label: 'User Flow',
        data: [100, 75, 50, 35, 20],
        backgroundColor: 'rgba(228, 191, 45, 0.6)',
        borderColor: '#E4BF2D',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#666',
        borderColor: '#E4BF2D',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (!isChartReady) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-500">Initializing charts...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Time Range Selector */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => setTimeRange('daily')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            timeRange === 'daily' 
              ? 'bg-[#E4BF2D] text-white shadow-md' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Calendar size={16} />
          Daily
        </button>
        <button
          onClick={() => setTimeRange('monthly')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            timeRange === 'monthly' 
              ? 'bg-[#E4BF2D] text-white shadow-md' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Calendar size={16} />
          Monthly
        </button>
        <button
          onClick={() => setTimeRange('quarterly')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            timeRange === 'quarterly' 
              ? 'bg-[#E4BF2D] text-white shadow-md' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Calendar size={16} />
          Quarterly
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Visitor Trend</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('visitors')}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedMetric === 'visitors'
                    ? 'bg-[#E4BF2D]/10 text-[#E4BF2D]'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Visitors
              </button>
              <button
                onClick={() => setSelectedMetric('pageviews')}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedMetric === 'pageviews'
                    ? 'bg-[#E4BF2D]/10 text-[#E4BF2D]'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Page Views
              </button>
            </div>
          </div>
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
            <Line data={visitorsData} options={lineOptions} />
          </Suspense>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Traffic Sources</h3>
          <div className="flex items-center justify-center">
            <div style={{ width: '300px', height: '300px' }}>
              <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
                <Pie data={sourceData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                      },
                    },
                  },
                }} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* User Behavior Path */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-6">User Behavior Path</h3>
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
            <Bar data={pathData} options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }} />
          </Suspense>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Geographic Distribution</h3>
          <div className="space-y-4">
            {[
              { city: 'Shanghai', percentage: 75 },
              { city: 'Beijing', percentage: 60 },
              { city: 'Guangzhou', percentage: 45 },
              { city: 'Shenzhen', percentage: 35 },
              { city: 'Hangzhou', percentage: 25 },
            ].map((item) => (
              <div key={item.city} className="flex justify-between items-center">
                <span className="text-gray-600 w-16">{item.city}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#E4BF2D] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-gray-600 w-12 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 