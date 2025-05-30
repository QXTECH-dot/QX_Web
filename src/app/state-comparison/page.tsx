"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, ExternalLink } from 'lucide-react';
import MultiStateComparison from '@/components/MultiStateComparison';

export default function StateComparisonPage() {
  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-3xl font-bold flex items-center">
              <BarChart3 className="h-7 w-7 mr-3 text-qxnet-600" />
              State Comparison Analytics
            </h1>
          </div>

          <div className="mt-2 text-gray-600 max-w-4xl">
            Compare key metrics across different Australian states and territories. This interactive tool allows you to select states, choose metrics like company count, growth rate, and industry distribution, and visualize the data in different chart formats.
          </div>
        </div>

        {/* Main comparison tool */}
        <MultiStateComparison className="mb-8" />

        {/* Additional info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h3 className="text-lg font-medium mb-2">How to Use</h3>
            <p className="text-sm text-gray-600 mb-3">
              Select states from the sidebar, choose a metric to compare, and adjust the chart type and time range options as needed. You can export the data or share your comparison.
            </p>
            <ul className="text-sm space-y-2 text-gray-600 list-disc pl-5">
              <li>Choose up to 5 states for clear visualization</li>
              <li>Switch between bar and line charts for time series data</li>
              <li>Export data as CSV for further analysis</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h3 className="text-lg font-medium mb-2">Available Metrics</h3>
            <ul className="text-sm space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                <span><strong>Company Count</strong> - Total number of tech companies</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                <span><strong>Growth Rate</strong> - Monthly percentage growth</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mt-1.5 mr-2"></span>
                <span><strong>Density</strong> - Companies per 10,000 km²</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                <span><strong>Industry Distribution</strong> - Breakdown by tech sector</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h3 className="text-lg font-medium mb-2">Analysis Tips</h3>
            <p className="text-sm text-gray-600 mb-3">
              Use this tool to identify patterns and opportunities across different regions in Australia's tech landscape.
            </p>
            <ul className="text-sm space-y-2 text-gray-600 list-disc pl-5">
              <li>Compare related states to identify regional trends</li>
              <li>Look for growth acceleration in emerging tech hubs</li>
              <li>Compare industry distributions to find specialization areas</li>
              <li>Track historical patterns to forecast future growth</li>
            </ul>
          </div>
        </div>

        {/* Related tools */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-medium mb-4">Related Analytics Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/"
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-qxnet-300 hover:shadow-md transition-all group"
            >
              <h4 className="font-medium mb-2 group-hover:text-qxnet-600">Australian Map</h4>
              <p className="text-sm text-gray-600 mb-3">
                Interactive visualization of tech companies across Australian states.
              </p>
              <span className="text-xs text-qxnet-600 flex items-center">
                View map <ExternalLink className="ml-1 h-3 w-3" />
              </span>
            </Link>

            <Link
              href="/state/new-south-wales"
              className="group block p-4 border border-gray-200 rounded-lg hover:border-qxnet-300 transition-colors"
            >
              <h4 className="font-medium mb-2 group-hover:text-qxnet-600">State Details</h4>
              <p className="text-sm text-gray-600 mb-3">
                Detailed information for individual states including company listings.
              </p>
              <span className="text-sm text-qxnet-600 group-hover:text-qxnet-700 inline-flex items-center">
                Explore details <ExternalLink className="ml-1 h-3 w-3" />
              </span>
            </Link>

            <Link
              href="/companies"
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-qxnet-300 hover:shadow-md transition-all group"
            >
              <h4 className="font-medium mb-2 group-hover:text-qxnet-600">Company Directory</h4>
              <p className="text-sm text-gray-600 mb-3">
                Browse and filter the complete directory of tech companies in Australia.
              </p>
              <span className="text-xs text-qxnet-600 flex items-center">
                View companies <ExternalLink className="ml-1 h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
