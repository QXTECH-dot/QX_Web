"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarChart, Calendar, Users, Globe, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminAnalyticsPage() {
  // Mock data for charts and statistics
  const visitorStats = [
    { month: 'Jan', visitors: 12500 },
    { month: 'Feb', visitors: 14200 },
    { month: 'Mar', visitors: 16800 },
    { month: 'Apr', visitors: 15900 },
    { month: 'May', visitors: 17500 },
    { month: 'Jun', visitors: 19200 },
  ];

  const topCountries = [
    { country: 'Australia', visitors: 45600, percentage: 65 },
    { country: 'United States', visitors: 9800, percentage: 14 },
    { country: 'United Kingdom', visitors: 5600, percentage: 8 },
    { country: 'New Zealand', visitors: 4200, percentage: 6 },
    { country: 'Singapore', visitors: 2100, percentage: 3 },
    { country: 'Other', visitors: 2800, percentage: 4 },
  ];

  const overviewStats = [
    {
      title: 'Total Visitors',
      value: '128.5k',
      change: '+12.3%',
      isPositive: true,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Page Views',
      value: '854.2k',
      change: '+24.5%',
      isPositive: true,
      icon: Globe,
      color: 'bg-green-500',
    },
    {
      title: 'Events Created',
      value: '48',
      change: '+8.7%',
      isPositive: true,
      icon: Calendar,
      color: 'bg-qxnet',
    },
    {
      title: 'Bounce Rate',
      value: '32.8%',
      change: '-5.2%',
      isPositive: true,  // For bounce rate, a decrease is positive
      icon: BarChart,
      color: 'bg-purple-500',
    },
  ];

  // Generate random data for daily visitors chart
  const dailyVisitors = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    visitors: Math.floor(Math.random() * 300) + 500,
  }));

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Overview of website traffic and user engagement metrics.</p>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="text-sm font-medium">{stat.change}</span>
                  {stat.isPositive ? (
                    <ArrowUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Visitors Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-6">Monthly Visitors</h2>
            <div className="h-64 w-full">
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-end">
                  {visitorStats.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-4/5 bg-qxnet-200 hover:bg-qxnet rounded-t transition-colors"
                        style={{ height: `${(month.visitors / 20000) * 100}%` }}
                      ></div>
                      <div className="text-xs mt-2 text-gray-500">{month.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Visitors Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-6">Daily Visitors (Last 30 Days)</h2>
            <div className="h-64 w-full">
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-end">
                  {dailyVisitors.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-1/2 bg-blue-200 hover:bg-blue-400 rounded-t transition-colors"
                        style={{ height: `${(day.visitors / 800) * 100}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources & Top Countries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-6">Traffic Sources</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Direct</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-qxnet h-2.5 rounded-full" style={{ width: '35%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Organic Search</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Social Media</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Referrals</span>
                <span className="font-medium">8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-6">Top Countries</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitors
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topCountries.map((country, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {country.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {country.visitors.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">{country.percentage}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-qxnet h-2 rounded-full"
                              style={{ width: `${country.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
