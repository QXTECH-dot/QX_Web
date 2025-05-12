"use client";

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Calendar, ChevronDown, TrendingUp, RefreshCcw, Flag } from 'lucide-react';
import { format, parse } from 'date-fns';
import { StateTimelineData, StateGrowthPoint, getSignificantEvents } from '@/lib/timelineDataUtils';

interface TimelineChartProps {
  timelineData: StateTimelineData[];
  showPrediction?: boolean;
  predictionData?: StateGrowthPoint[];
  title?: string;
  className?: string;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  timelineData,
  showPrediction = false,
  predictionData = [],
  title = "Company Growth Timeline",
  className = ""
}) => {
  const [dataType, setDataType] = useState<'count' | 'growth'>('count');
  const [timeRange, setTimeRange] = useState<number>(24);
  const [showEvents, setShowEvents] = useState<boolean>(false);

  // Get all significant events
  const significantEvents = getSignificantEvents();

  // Format date for tooltip
  const formatDate = (dateStr: string) => {
    try {
      const date = parse(dateStr, 'yyyy-MM', new Date());
      return format(date, 'MMM yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  // Process timeline data to include only the selected time range
  const processedData = timelineData.map(state => {
    return {
      ...state,
      data: state.data.slice(-timeRange)
    };
  });

  // Merge all data points for the chart
  const mergedDataPoints: any[] = [];

  // Helper function to merge data points by date
  const mergeDataByDate = () => {
    // Reset merged points
    mergedDataPoints.length = 0;

    // Get all unique dates
    const allDates = new Set<string>();
    processedData.forEach(state => {
      state.data.forEach(point => {
        allDates.add(point.date);
      });
    });

    // If prediction is enabled, add prediction dates
    if (showPrediction && predictionData.length > 0) {
      predictionData.forEach(point => {
        allDates.add(point.date);
      });
    }

    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    // Create merged data points
    sortedDates.forEach(date => {
      const point: any = { date };

      // Add each state's data
      processedData.forEach(state => {
        const statePoint = state.data.find(p => p.date === date);
        if (statePoint) {
          point[`${state.id}_${dataType}`] = statePoint[dataType];
        }
      });

      // Add prediction data if enabled
      if (showPrediction && predictionData.length > 0) {
        const predPoint = predictionData.find(p => p.date === date);
        if (predPoint) {
          point[`prediction_${dataType}`] = predPoint[dataType];
        }
      }

      mergedDataPoints.push(point);
    });
  };

  // Merge data
  mergeDataByDate();

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md text-sm">
          <p className="font-medium">{formatDate(label)}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => {
              // Extract state ID from the dataKey
              const parts = entry.dataKey.split('_');
              const stateId = parts[0];
              const isPrediction = stateId === 'prediction';

              // Find state name
              let stateName = 'Prediction';
              if (!isPrediction) {
                const state = timelineData.find(s => s.id === stateId);
                stateName = state ? state.name : stateId;
              }

              return (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: isPrediction ? '#e84393' : entry.color }}
                  ></div>
                  <span className="mr-2">{stateName}:</span>
                  <span className="font-medium">
                    {dataType === 'count'
                      ? entry.value
                      : `${entry.value > 0 ? '+' : ''}${entry.value}%`
                    }
                  </span>
                </div>
              );
            })}
          </div>

          {/* Show event if there is one on this date */}
          {showEvents && significantEvents.map((event, index) => {
            if (event.date === label) {
              return (
                <div key={index} className="mt-2 pt-2 border-t border-gray-200">
                  <p className="font-medium text-qxnet-700 flex items-center">
                    <Flag className="h-3 w-3 mr-1" /> {event.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  // Get Y-axis domain
  const getYAxisDomain = () => {
    if (dataType === 'count') {
      // Find min and max counts
      let min = Infinity;
      let max = -Infinity;

      mergedDataPoints.forEach(point => {
        Object.keys(point).forEach(key => {
          if (key !== 'date' && key.endsWith('_count')) {
            const value = point[key];
            min = Math.min(min, value);
            max = Math.max(max, value);
          }
        });
      });

      // Add some padding
      min = Math.max(0, Math.floor(min * 0.9));
      max = Math.ceil(max * 1.1);

      return [min, max];
    } else {
      // Growth rate domain
      return [-2, 5]; // Common range for percentage growth
    }
  };

  // Find prediction split point
  const findPredictionStartDate = () => {
    if (!showPrediction || predictionData.length === 0) return null;
    return predictionData[0]?.date;
  };

  const predictionStartDate = findPredictionStartDate();

  // Get Y-axis label
  const getYAxisLabel = () => {
    return dataType === 'count' ? 'Number of Companies' : 'Growth Rate (%)';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>

        <div className="flex flex-wrap mt-2 sm:mt-0 gap-2">
          {/* Time range selector */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-qxnet"
            >
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 12 months</option>
              <option value={24}>Last 24 months</option>
              <option value={36}>Last 36 months</option>
            </select>
            <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Data type selector */}
          <div className="relative">
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as 'count' | 'growth')}
              className="appearance-none bg-white border border-gray-200 rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-qxnet"
            >
              <option value="count">Company Count</option>
              <option value="growth">Growth Rate</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Toggle events */}
          <button
            onClick={() => setShowEvents(!showEvents)}
            className={`flex items-center px-3 py-1.5 text-sm rounded transition-colors ${
              showEvents
                ? 'bg-qxnet-50 text-qxnet-700 border border-qxnet-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            <Flag className="h-4 w-4 mr-1.5" />
            Events
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mergedDataPoints}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={getYAxisDomain()}
              tick={{ fontSize: 12 }}
              label={{
                value: getYAxisLabel(),
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#666' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Draw lines for each state */}
            {processedData.map((state) => (
              <Line
                key={state.id}
                type="monotone"
                dataKey={`${state.id}_${dataType}`}
                name={state.name}
                stroke={state.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
              />
            ))}

            {/* Draw prediction line if enabled */}
            {showPrediction && predictionData.length > 0 && (
              <Line
                type="monotone"
                dataKey={`prediction_${dataType}`}
                name="Prediction"
                stroke="#e84393"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
              />
            )}

            {/* Reference line for prediction start */}
            {showPrediction && predictionStartDate && (
              <ReferenceLine
                x={predictionStartDate}
                stroke="#e84393"
                strokeDasharray="3 3"
                label={{
                  value: 'Prediction Start',
                  position: 'top',
                  fill: '#e84393',
                  fontSize: 11
                }}
              />
            )}

            {/* Add reference lines for significant events */}
            {showEvents && significantEvents.map((event, index) => (
              <ReferenceLine
                key={index}
                x={event.date}
                stroke="#6c5ce7"
                strokeDasharray="3 3"
                label={{
                  value: event.title,
                  position: 'top',
                  fill: '#6c5ce7',
                  fontSize: 10
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend for prediction and events */}
      {(showPrediction || showEvents) && (
        <div className="flex flex-wrap items-center mt-4 text-xs text-gray-600 space-x-4">
          {showPrediction && (
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-pink-500 mr-1.5 border-t border-b border-dashed"></div>
              <span>Prediction based on historical trends</span>
            </div>
          )}
          {showEvents && (
            <div className="flex items-center">
              <div className="w-3 h-0.5 border-t border-b border-indigo-500 border-dashed mr-1.5"></div>
              <span>Significant market events</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimelineChart;
