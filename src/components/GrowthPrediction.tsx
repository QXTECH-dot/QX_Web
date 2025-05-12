"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, ChevronDown, AlertTriangle, BarChart2, ArrowRight } from 'lucide-react';
import TimelineChart from './TimelineChart';
import {
  getStateTimelineData,
  getGrowthPrediction,
  StateTimelineData,
  StateGrowthPoint
} from '@/lib/timelineDataUtils';
import { stateNames } from '@/lib/mapDataUtils';

interface GrowthPredictionProps {
  initialStateId?: string;
  className?: string;
}

const GrowthPrediction: React.FC<GrowthPredictionProps> = ({
  initialStateId = 'new-south-wales',
  className = ''
}) => {
  const [selectedStateId, setSelectedStateId] = useState<string>(initialStateId);
  const [timelineData, setTimelineData] = useState<StateTimelineData[]>([]);
  const [predictionData, setPredictionData] = useState<StateGrowthPoint[]>([]);
  const [showPrediction, setShowPrediction] = useState<boolean>(true);
  const [comparisonStateId, setComparisonStateId] = useState<string | null>(null);

  // Load timeline data when selected state changes
  useEffect(() => {
    // Get data for selected state
    const stateData = getStateTimelineData(selectedStateId);

    // Get prediction data
    const prediction = getGrowthPrediction(selectedStateId);
    setPredictionData(prediction);

    // Set timeline data (including comparison state if selected)
    if (comparisonStateId) {
      const comparisonData = getStateTimelineData(comparisonStateId);
      setTimelineData([stateData, comparisonData]);
    } else {
      setTimelineData([stateData]);
    }
  }, [selectedStateId, comparisonStateId]);

  // Calculate growth indicators
  const calculateGrowthIndicators = () => {
    if (!predictionData.length) return { current: 0, future: 0 };

    // Current growth rate (average of last 3 months)
    const selectedState = timelineData.find(state => state.id === selectedStateId);
    if (!selectedState) return { current: 0, future: 0 };

    const recentData = selectedState.data.slice(-3);
    const currentGrowth = recentData.reduce((sum, point) => sum + point.growth, 0) / recentData.length;

    // Future growth rate (average of predictions)
    const futureGrowth = predictionData.reduce((sum, point) => sum + point.growth, 0) / predictionData.length;

    return {
      current: Number(currentGrowth.toFixed(1)),
      future: Number(futureGrowth.toFixed(1))
    };
  };

  const { current, future } = calculateGrowthIndicators();

  // Calculate if growth is accelerating, stable, or decelerating
  const growthTrend = future > current + 0.3 ? 'accelerating' :
                      future < current - 0.3 ? 'decelerating' : 'stable';

  // Company count at the end of prediction period
  const getFinalCount = () => {
    if (!predictionData.length) return 0;
    return predictionData[predictionData.length - 1].count;
  };

  // Get current count
  const getCurrentCount = () => {
    const selectedState = timelineData.find(state => state.id === selectedStateId);
    if (!selectedState || !selectedState.data.length) return 0;
    return selectedState.data[selectedState.data.length - 1].count;
  };

  // Calculate growth percentage over prediction period
  const getGrowthPercentage = () => {
    const currentCount = getCurrentCount();
    const finalCount = getFinalCount();
    if (!currentCount) return 0;

    return Number(((finalCount - currentCount) / currentCount * 100).toFixed(1));
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xl font-semibold flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-qxnet-600" />
            Company Growth Prediction
          </h2>

          <div className="flex flex-wrap gap-3">
            {/* State selector */}
            <div className="relative">
              <select
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-qxnet"
              >
                {Object.entries(stateNames).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Comparison state selector */}
            <div className="relative">
              <select
                value={comparisonStateId || ''}
                onChange={(e) => setComparisonStateId(e.target.value || null)}
                className="appearance-none bg-white border border-gray-200 rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-qxnet"
              >
                <option value="">Compare with state...</option>
                {Object.entries(stateNames)
                  .filter(([id]) => id !== selectedStateId)
                  .map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Toggle prediction */}
            <button
              onClick={() => setShowPrediction(!showPrediction)}
              className={`flex items-center px-3 py-1.5 text-sm rounded transition-colors ${
                showPrediction
                  ? 'bg-qxnet-50 text-qxnet-700 border border-qxnet-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <BarChart2 className="h-4 w-4 mr-1.5" />
              Show Prediction
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Growth indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Current Growth Rate</div>
            <div className="text-2xl font-bold flex items-center">
              <span className={current >= 0 ? 'text-green-600' : 'text-red-600'}>
                {current >= 0 ? '+' : ''}{current}%
              </span>
              <span className="ml-2 text-sm font-normal text-gray-500">per month</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Projected Growth Rate</div>
            <div className="text-2xl font-bold flex items-center">
              <span className={future >= 0 ? 'text-green-600' : 'text-red-600'}>
                {future >= 0 ? '+' : ''}{future}%
              </span>
              <span className="ml-2 text-sm font-normal text-gray-500">per month</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">6-Month Projection</div>
            <div className="text-2xl font-bold flex items-center">
              <span className={getGrowthPercentage() >= 0 ? 'text-green-600' : 'text-red-600'}>
                {getGrowthPercentage() >= 0 ? '+' : ''}{getGrowthPercentage()}%
              </span>
              <span className="ml-2 text-sm font-normal text-gray-500">overall</span>
            </div>
          </div>
        </div>

        {/* Growth trend indicator */}
        <div className={`mb-6 p-4 rounded-lg ${
          growthTrend === 'accelerating' ? 'bg-green-50 border border-green-100' :
          growthTrend === 'decelerating' ? 'bg-yellow-50 border border-yellow-100' :
          'bg-blue-50 border border-blue-100'
        }`}>
          <div className="flex items-start">
            {growthTrend === 'accelerating' ? (
              <TrendingUp className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            ) : growthTrend === 'decelerating' ? (
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            ) : (
              <BarChart2 className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            )}

            <div>
              <h4 className="font-medium">
                {growthTrend === 'accelerating'
                  ? 'Accelerating Growth'
                  : growthTrend === 'decelerating'
                    ? 'Decelerating Growth'
                    : 'Stable Growth'
                }
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {growthTrend === 'accelerating'
                  ? `The tech sector in ${stateNames[selectedStateId as keyof typeof stateNames]} is projected to accelerate in growth over the next 6 months. This indicates a strong market for technology companies in this region.`
                  : growthTrend === 'decelerating'
                    ? `Growth is expected to slow down in ${stateNames[selectedStateId as keyof typeof stateNames]} over the next 6 months. Companies may need to adjust their expansion strategies accordingly.`
                    : `The tech sector in ${stateNames[selectedStateId as keyof typeof stateNames]} is expected to maintain its current growth trajectory over the next 6 months.`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Timeline chart */}
        <TimelineChart
          timelineData={timelineData}
          showPrediction={showPrediction}
          predictionData={predictionData}
          title={`${stateNames[selectedStateId as keyof typeof stateNames]} Growth Timeline${
            comparisonStateId ? ` vs ${stateNames[comparisonStateId as keyof typeof stateNames]}` : ''
          }`}
        />

        {/* Key insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Key Growth Factors</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <ArrowRight className="h-4 w-4 text-green-600" />
                </div>
                <span>
                  <strong>Tech Hub Development:</strong> Continued investment in tech infrastructure and innovation centers
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <ArrowRight className="h-4 w-4 text-green-600" />
                </div>
                <span>
                  <strong>Talent Attraction:</strong> Skilled workforce migration to tech-friendly regions
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <ArrowRight className="h-4 w-4 text-green-600" />
                </div>
                <span>
                  <strong>Government Incentives:</strong> Tax breaks and grants for tech startups
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Growth Challenges</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <span>
                  <strong>Economic Uncertainty:</strong> Global economic conditions may impact investment
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <span>
                  <strong>Talent Competition:</strong> Increasing competition for skilled tech workers
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <span>
                  <strong>Regulatory Changes:</strong> Potential changes in tech industry regulations
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-xs text-gray-500 border-t border-gray-100 pt-4">
          <p>
            <strong>Note:</strong> Predictions are based on historical data and industry trends.
            Actual growth may vary due to unforeseen market conditions and other external factors.
            This forecast should be used as one of many tools in business planning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrowthPrediction;
