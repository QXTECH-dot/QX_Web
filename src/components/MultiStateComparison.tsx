"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  ChevronDown,
  Filter,
  X,
  Download,
  Share2,
  ArrowUpRight,
  PanelLeft,
  PanelRight,
  BarChart3
} from 'lucide-react';
import { getStateTimelineData, getSignificantEvents, getGrowthPrediction } from '@/lib/timelineDataUtils';
import { stateNames } from '@/lib/mapDataUtils';

type ComparisonMetric = 'company_count' | 'growth_rate' | 'density' | 'funding' | 'industries';
type ChartType = 'bar' | 'line' | 'radar';
type TimeRange = '1y' | '2y' | '3y' | 'all';

interface MultiStateComparisonProps {
  initialStates?: string[];
  className?: string;
}

const MultiStateComparison: React.FC<MultiStateComparisonProps> = ({
  initialStates = ['new-south-wales', 'victoria', 'queensland'],
  className = ''
}) => {
  const [selectedStates, setSelectedStates] = useState<string[]>(initialStates);
  const [availableStates, setAvailableStates] = useState<{id: string, name: string}[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<ComparisonMetric>('company_count');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [timeRange, setTimeRange] = useState<TimeRange>('2y');
  const [showSidebar, setShowSidebar] = useState(true);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Setup available states
  useEffect(() => {
    const states = Object.entries(stateNames).map(([id, name]) => ({ id, name }));
    setAvailableStates(states);
  }, []);

  // Fetch comparison data when states or metrics change
  useEffect(() => {
    if (selectedStates.length === 0) return;

    setIsLoading(true);

    const fetchData = async () => {
      try {
        // Get state timeline data for each selected state
        const statesData = selectedStates.map(stateId => {
          return getStateTimelineData(stateId);
        });

        // Create comparison data based on selected metric
        let comparisonPoints: any[] = [];

        if (selectedMetric === 'company_count' || selectedMetric === 'growth_rate') {
          // Determine the number of months to include based on time range
          const monthCount = timeRange === '1y' ? 12 : timeRange === '2y' ? 24 : timeRange === '3y' ? 36 : 48;

          // Get all unique dates across all states
          const allDates = new Set<string>();
          statesData.forEach(state => {
            state.data.slice(-monthCount).forEach(point => {
              allDates.add(point.date);
            });
          });

          // Sort dates
          const sortedDates = Array.from(allDates).sort();

          // Create data points for each date
          sortedDates.forEach(date => {
            const point: any = { date };

            // Add each state's data for this date
            statesData.forEach(state => {
              const statePoint = state.data.find(p => p.date === date);
              if (statePoint) {
                const value = selectedMetric === 'company_count' ? statePoint.count : statePoint.growth;
                point[state.name] = value;
              }
            });

            comparisonPoints.push(point);
          });
        } else if (selectedMetric === 'density') {
          // Calculate current density for each state
          comparisonPoints = statesData.map(state => {
            const latestPoint = state.data[state.data.length - 1];
            return {
              name: state.name,
              value: latestPoint.count / getStateLandArea(state.id)
            };
          });
        } else if (selectedMetric === 'funding') {
          // Simulate funding data
          comparisonPoints = statesData.map(state => {
            const latestCount = state.data[state.data.length - 1].count;
            // Generate a funding amount based on company count and a random factor
            const fundingAmount = latestCount * (Math.random() * 1.5 + 0.8) * 1000000;
            return {
              name: state.name,
              value: Math.round(fundingAmount / 1000000) // in millions
            };
          });
        }

        setComparisonData(comparisonPoints);

        // Generate radar data for industry comparison
        const industries = ['Web Dev', 'Mobile', 'AI/ML', 'Cloud', 'Cybersecurity', 'E-commerce'];
        const radarPoints = [];

        for (const state of statesData) {
          const stateRadarData: any = { name: state.name };

          // Generate simulated industry data based on company count
          const latestCount = state.data[state.data.length - 1].count;

          industries.forEach(industry => {
            // Random distribution of companies across industries
            const factor = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
            let count = Math.round(latestCount * factor);

            // Adjust counts based on industry and state (simulating realistic distribution)
            if (industry === 'AI/ML' && (state.id === 'new-south-wales' || state.id === 'victoria')) {
              count = Math.round(count * 1.3); // More AI in NSW and VIC
            } else if (industry === 'Cloud' && state.id === 'australian-capital-territory') {
              count = Math.round(count * 1.4); // More cloud in ACT
            } else if (industry === 'Cybersecurity' && state.id === 'australian-capital-territory') {
              count = Math.round(count * 1.5); // More cybersec in ACT
            }

            stateRadarData[industry] = count;
          });

          radarPoints.push(stateRadarData);
        }

        setRadarData(radarPoints);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading comparison data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedStates, selectedMetric, timeRange]);

  // Toggle state selection
  const handleStateToggle = (stateId: string) => {
    if (selectedStates.includes(stateId)) {
      setSelectedStates(selectedStates.filter(id => id !== stateId));
    } else {
      if (selectedStates.length < 5) { // Limit to 5 states for readability
        setSelectedStates([...selectedStates, stateId]);
      }
    }
  };

  // Clear all selected states
  const clearSelectedStates = () => {
    setSelectedStates([]);
  };

  // Helper to get state land area (approximate, in km²)
  const getStateLandArea = (stateId: string): number => {
    const landAreas: Record<string, number> = {
      'new-south-wales': 809952,
      'victoria': 227416,
      'queensland': 1852642,
      'western-australia': 2526786,
      'south-australia': 983482,
      'tasmania': 68401,
      'northern-territory': 1420968,
      'australian-capital-territory': 2358,
    };

    return landAreas[stateId] || 100000;
  };

  // Helper to format values based on metric
  const formatValue = (value: number) => {
    if (selectedMetric === 'company_count') {
      return value.toLocaleString();
    } else if (selectedMetric === 'growth_rate') {
      return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    } else if (selectedMetric === 'density') {
      return `${value.toFixed(2)} per 10,000 km²`;
    } else if (selectedMetric === 'funding') {
      return `$${value}M`;
    }
    return value;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md text-sm">
          {selectedMetric === 'company_count' || selectedMetric === 'growth_rate' ? (
            <>
              <p className="font-medium mb-1">{label}</p>
              <div className="space-y-1">
                {payload.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="mr-2">{entry.name}:</span>
                    <span className="font-medium">
                      {formatValue(entry.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="font-medium mb-1">{payload[0].name}</p>
              <div className="flex items-center">
                <span className="mr-2">{getMetricLabel(selectedMetric)}:</span>
                <span className="font-medium">
                  {formatValue(payload[0].value)}
                </span>
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Get label for selected metric
  const getMetricLabel = (metric: ComparisonMetric): string => {
    switch (metric) {
      case 'company_count':
        return 'Company Count';
      case 'growth_rate':
        return 'Growth Rate';
      case 'density':
        return 'Company Density';
      case 'funding':
        return 'Estimated Funding';
      case 'industries':
        return 'Industry Distribution';
      default:
        return 'Value';
    }
  };

  // Check if we should show the industry radar chart
  const showRadarChart = selectedMetric === 'industries' && selectedStates.length > 0;

  // Check if we should show time-series chart
  const showTimeSeriesChart = (selectedMetric === 'company_count' || selectedMetric === 'growth_rate') && selectedStates.length > 0;

  // Check if we should show bar chart
  const showBarChart = (selectedMetric === 'density' || selectedMetric === 'funding') && selectedStates.length > 0;

  // Get the correct sort of comparison data
  const getChartData = () => {
    if (showTimeSeriesChart) {
      return comparisonData;
    } else if (showBarChart) {
      return comparisonData.sort((a, b) => b.value - a.value);
    } else if (showRadarChart) {
      return radarData;
    }
    return [];
  };

  // Export data
  const handleExport = () => {
    // Create a CSV string from the data
    const isTimeSeries = showTimeSeriesChart;
    const data = getChartData();

    if (!data.length) return;

    let csvContent = 'data:text/csv;charset=utf-8,';

    // Add headers
    const headers = isTimeSeries ?
      ['Date', ...selectedStates.map(id => stateNames[id as keyof typeof stateNames])] :
      showRadarChart ?
        ['State', 'Web Dev', 'Mobile', 'AI/ML', 'Cloud', 'Cybersecurity', 'E-commerce'] :
        ['State', getMetricLabel(selectedMetric)];

    csvContent += headers.join(',') + '\n';

    // Add data rows
    data.forEach((item: any) => {
      if (isTimeSeries) {
        const row = [item.date];
        selectedStates.forEach(stateId => {
          const stateName = stateNames[stateId as keyof typeof stateNames];
          row.push(item[stateName] !== undefined ? item[stateName] : '');
        });
        csvContent += row.join(',') + '\n';
      } else if (showRadarChart) {
        const row = [item.name, item['Web Dev'], item['Mobile'], item['AI/ML'], item['Cloud'], item['Cybersecurity'], item['E-commerce']];
        csvContent += row.join(',') + '\n';
      } else {
        csvContent += `${item.name},${item.value}\n`;
      }
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `state_comparison_${selectedMetric}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-gray-500" />
          Multi-State Comparison
        </h2>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
            title={showSidebar ? "Hide sidebar" : "Show sidebar"}
          >
            {showSidebar ? <PanelLeft size={18} /> : <PanelRight size={18} />}
          </button>

          <button
            onClick={handleExport}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
            title="Export data"
          >
            <Download size={18} />
          </button>

          <button
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
            title="Share comparison"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* Sidebar with controls */}
        {showSidebar && (
          <div className="w-64 border-r border-gray-200 p-4 flex flex-col h-full overflow-y-auto">
            {/* Metric selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare by</label>
              <div className="relative">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as ComparisonMetric)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-qxnet focus:border-qxnet sm:text-sm"
                >
                  <option value="company_count">Company Count</option>
                  <option value="growth_rate">Growth Rate</option>
                  <option value="density">Company Density</option>
                  <option value="funding">Estimated Funding</option>
                  <option value="industries">Industry Distribution</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Chart type selector (only for time series) */}
            {(selectedMetric === 'company_count' || selectedMetric === 'growth_rate') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`flex-1 py-2 text-sm font-medium ${
                      chartType === 'bar'
                        ? 'bg-qxnet text-black'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`flex-1 py-2 text-sm font-medium ${
                      chartType === 'line'
                        ? 'bg-qxnet text-black'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Line
                  </button>
                </div>
              </div>
            )}

            {/* Time range selector (only for time series) */}
            {(selectedMetric === 'company_count' || selectedMetric === 'growth_rate') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTimeRange('1y')}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      timeRange === '1y'
                        ? 'bg-qxnet text-black'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    1 Year
                  </button>
                  <button
                    onClick={() => setTimeRange('2y')}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      timeRange === '2y'
                        ? 'bg-qxnet text-black'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    2 Years
                  </button>
                  <button
                    onClick={() => setTimeRange('3y')}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      timeRange === '3y'
                        ? 'bg-qxnet text-black'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    3 Years
                  </button>
                </div>
              </div>
            )}

            {/* State selector */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Select States</label>
                {selectedStates.length > 0 && (
                  <button
                    onClick={clearSelectedStates}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <X size={12} className="mr-1" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-2">
                {availableStates.map((state) => (
                  <div key={state.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`state-${state.id}`}
                      checked={selectedStates.includes(state.id)}
                      onChange={() => handleStateToggle(state.id)}
                      className="h-4 w-4 text-qxnet focus:ring-qxnet border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`state-${state.id}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {state.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main content area with chart */}
        <div className="flex-1 p-4 h-full overflow-hidden">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse w-12 h-12 border-t-2 border-qxnet rounded-full animate-spin"></div>
            </div>
          ) : selectedStates.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <Filter className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">Select states to compare</h3>
                <p className="text-gray-500">
                  Choose at least one state from the sidebar to see comparison data.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-medium mb-4">
                {getMetricLabel(selectedMetric)} Comparison
              </h3>

              <div className="flex-1 min-h-0">
                {showTimeSeriesChart && (
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <LineChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const [year, month] = value.split('-');
                            return `${month}/${year.slice(2)}`;
                          }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            return selectedMetric === 'growth_rate'
                              ? `${value}%`
                              : value.toString();
                          }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {selectedStates.map((stateId, index) => {
                          const stateName = stateNames[stateId as keyof typeof stateNames];
                          // Generate colors from a predefined set or use a scheme
                          const colors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12', '#1abc9c', '#34495e'];
                          return (
                            <Line
                              key={stateId}
                              type="monotone"
                              dataKey={stateName}
                              name={stateName}
                              stroke={colors[index % colors.length]}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          );
                        })}
                      </LineChart>
                    ) : (
                      <BarChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const [year, month] = value.split('-');
                            return `${month}/${year.slice(2)}`;
                          }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            return selectedMetric === 'growth_rate'
                              ? `${value}%`
                              : value.toString();
                          }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {selectedStates.map((stateId, index) => {
                          const stateName = stateNames[stateId as keyof typeof stateNames];
                          const colors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12', '#1abc9c', '#34495e'];
                          return (
                            <Bar
                              key={stateId}
                              dataKey={stateName}
                              name={stateName}
                              fill={colors[index % colors.length]}
                            />
                          );
                        })}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                )}

                {showBarChart && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getChartData()}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="value"
                        fill="#3498db"
                        name={getMetricLabel(selectedMetric)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {showRadarChart && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={150} data={getChartData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      {radarData.map((entry, index) => {
                        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12'];
                        return (
                          <Radar
                            key={entry.name}
                            name={entry.name}
                            dataKey={(value) => {
                              const industries = ['Web Dev', 'Mobile', 'AI/ML', 'Cloud', 'Cybersecurity', 'E-commerce'];
                              const currentIndustry = value.subject;
                              if (industries.includes(currentIndustry)) {
                                return entry[currentIndustry];
                              }
                              return 0;
                            }}
                            stroke={colors[index % colors.length]}
                            fill={colors[index % colors.length]}
                            fillOpacity={0.2}
                          />
                        );
                      })}
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {selectedMetric === 'industries' && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    This radar chart shows the distribution of companies across different industry categories.
                    The further a point is from the center, the more companies are in that industry category for that state.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStateComparison;
