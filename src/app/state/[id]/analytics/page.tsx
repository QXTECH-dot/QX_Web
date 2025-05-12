"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  Users,
  Briefcase,
  Cpu,
  Smartphone,
  Globe,
  Database,
  Layers
} from 'lucide-react';
import GrowthPrediction from '@/components/GrowthPrediction';
import TimelineChart from '@/components/TimelineChart';
import {
  getStateTimelineData,
  getGrowthPrediction,
  getSignificantEvents
} from '@/lib/timelineDataUtils';
import { stateNames } from '@/lib/mapDataUtils';

const StateAnalyticsPage = () => {
  const params = useParams();
  const stateId = params?.id as string;
  const [selectedTab, setSelectedTab] = useState<'overview' | 'industries' | 'prediction'>('overview');
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [predictionData, setPredictionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load state data
  useEffect(() => {
    if (stateId) {
      // Get timeline data
      const stateData = getStateTimelineData(stateId);
      setTimelineData([stateData]);

      // Get prediction data
      const prediction = getGrowthPrediction(stateId);
      setPredictionData(prediction);

      setLoading(false);
    }
  }, [stateId]);

  // Get state name
  const stateName = stateNames[stateId as keyof typeof stateNames] || stateId;

  // Get significant events
  const events = getSignificantEvents();

  // Industry growth data
  const industryGrowth = [
    { name: 'Web Development', growth: 5.2, count: 42, color: '#3498db' },
    { name: 'Mobile Development', growth: 7.8, count: 35, color: '#2ecc71' },
    { name: 'AI & Machine Learning', growth: 12.4, count: 28, color: '#9b59b6' },
    { name: 'Cloud Services', growth: 8.6, count: 31, color: '#e74c3c' },
    { name: 'Cybersecurity', growth: 6.3, count: 24, color: '#f39c12' },
    { name: 'E-commerce', growth: 5.9, count: 19, color: '#1abc9c' },
    { name: 'Fintech', growth: 9.2, count: 15, color: '#34495e' },
  ];

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-1/2 mx-auto mb-6"></div>
            <div className="h-96 bg-gray-100 rounded-lg mb-6"></div>
            <div className="h-40 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/state/${stateId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {stateName} Overview
          </Link>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-3xl font-bold">{stateName} Analytics</h1>

            <div className="bg-qxnet-50 border border-qxnet-200 rounded-lg px-4 py-2 flex items-center text-qxnet-700">
              <Building2 className="h-5 w-5 mr-2" />
              <span className="font-medium">
                {timelineData[0]?.data[timelineData[0]?.data.length - 1]?.count || 0} tech companies
              </span>
            </div>
          </div>

          <div className="mt-2 text-gray-600">
            Comprehensive data analysis and growth predictions for the tech sector in {stateName}.
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`mr-6 py-4 px-1 ${
                selectedTab === 'overview'
                  ? 'border-b-2 border-qxnet-500 text-qxnet-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('industries')}
              className={`mr-6 py-4 px-1 ${
                selectedTab === 'industries'
                  ? 'border-b-2 border-qxnet-500 text-qxnet-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Industry Analysis
            </button>
            <button
              onClick={() => setSelectedTab('prediction')}
              className={`mr-6 py-4 px-1 ${
                selectedTab === 'prediction'
                  ? 'border-b-2 border-qxnet-500 text-qxnet-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Growth Prediction
            </button>
          </nav>
        </div>

        {/* Tab content */}
        {selectedTab === 'overview' && (
          <>
            {/* Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-600 text-sm">Growth Rate</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  +{(timelineData[0]?.data.slice(-3).reduce((sum, point) => sum + point.growth, 0) / 3).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Average monthly growth</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center mb-2">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-600 text-sm">Workforce</span>
                </div>
                <div className="text-2xl font-bold">
                  {(timelineData[0]?.data[timelineData[0]?.data.length - 1]?.count * 45).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Estimated tech employees</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center mb-2">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-600 text-sm">Job Openings</span>
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(timelineData[0]?.data[timelineData[0]?.data.length - 1]?.count * 12).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Current tech job openings</div>
              </div>
            </div>

            {/* Growth timeline */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Historical Growth Timeline</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <TimelineChart
                  timelineData={timelineData}
                  showPrediction={true}
                  predictionData={predictionData}
                  title={`${stateName} Historical Growth Data`}
                />
              </div>
            </div>

            {/* Key events */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Key Growth Events</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>

                  <div className="space-y-8">
                    {events.map((event, index) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-0 top-0 bg-qxnet w-8 h-8 rounded-full text-black flex items-center justify-center text-xs font-medium">
                          {event.date.split('-')[1]}
                        </div>
                        <div>
                          <h3 className="font-medium">{event.date.split('-')[0]} - {event.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'industries' && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Industry Breakdown</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Industry chart would go here - simplified version with cards */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Industry Distribution</h3>
                    <div className="space-y-4">
                      {industryGrowth.map((industry) => (
                        <div key={industry.name} className="flex items-center">
                          <div className="w-24 text-sm font-medium text-gray-600">{industry.name}</div>
                          <div className="flex-grow ml-4">
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(industry.count / Math.max(...industryGrowth.map(i => i.count))) * 100}%`,
                                  backgroundColor: industry.color
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="ml-4 w-12 text-right text-sm font-medium">
                            {industry.count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Growth Rate by Industry</h3>
                    <div className="space-y-4">
                      {industryGrowth.sort((a, b) => b.growth - a.growth).map((industry) => (
                        <div key={industry.name} className="flex items-center">
                          <div className="w-24 text-sm font-medium text-gray-600">{industry.name}</div>
                          <div className="flex-grow ml-4">
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(industry.growth / Math.max(...industryGrowth.map(i => i.growth))) * 100}%`,
                                  backgroundColor: industry.color
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="ml-4 w-16 text-right text-sm font-medium text-green-600">
                            +{industry.growth}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top tech categories */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Top Tech Categories in {stateName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-3 rounded-full mr-4">
                      <Globe className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Web Dev</div>
                      <div className="font-medium text-lg">{Math.round(timelineData[0]?.data[timelineData[0]?.data.length - 1]?.count * 0.4)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center">
                    <div className="bg-green-50 p-3 rounded-full mr-4">
                      <Smartphone className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Mobile</div>
                      <div className="font-medium text-lg">{Math.round(timelineData[0]?.data[timelineData[0]?.data.length - 1]?.count * 0.35)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center">
                    <div className="bg-purple-50 p-3 rounded-full mr-4">
                      <Cpu className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">AI & ML</div>
                      <div className="font-medium text-lg">{Math.round(timelineData[0]?.data[timelineData[0]?.data.length - 1]?.count * 0.25)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center">
                    <div className="bg-yellow-50 p-3 rounded-full mr-4">
                      <Database className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Cloud</div>
                      <div className="font-medium text-lg">{Math.round(timelineData[0]?.data[timelineData[0]?.data.length - 1]?.count * 0.3)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech stack popularity */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Most Popular Tech Stacks</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Layers className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-medium">Web Development</h3>
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center justify-between">
                        <span>React</span>
                        <span className="text-green-600 font-medium">68%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Node.js</span>
                        <span className="text-green-600 font-medium">62%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Next.js</span>
                        <span className="text-green-600 font-medium">54%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>TypeScript</span>
                        <span className="text-green-600 font-medium">49%</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <Layers className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-medium">Mobile Development</h3>
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center justify-between">
                        <span>React Native</span>
                        <span className="text-green-600 font-medium">59%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Flutter</span>
                        <span className="text-green-600 font-medium">42%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Swift</span>
                        <span className="text-green-600 font-medium">37%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Kotlin</span>
                        <span className="text-green-600 font-medium">33%</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <Layers className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="font-medium">Data & AI</h3>
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Python</span>
                        <span className="text-green-600 font-medium">76%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>TensorFlow</span>
                        <span className="text-green-600 font-medium">51%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>PyTorch</span>
                        <span className="text-green-600 font-medium">44%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Pandas</span>
                        <span className="text-green-600 font-medium">40%</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'prediction' && (
          <GrowthPrediction initialStateId={stateId} />
        )}
      </div>
    </div>
  );
};

export default StateAnalyticsPage;
