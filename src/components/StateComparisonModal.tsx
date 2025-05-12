"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, BarChart2, PieChart, ArrowUpRight } from 'lucide-react';
import { stateNames } from '@/lib/mapDataUtils';

type StateComparisonModalProps = {
  onClose: () => void;
  mapData: any;
};

const StateComparisonModal = ({ onClose, mapData }: StateComparisonModalProps) => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [compareMetric, setCompareMetric] = useState<string>('companies');

  // Initialize with top states by company count
  useEffect(() => {
    if (mapData && Object.keys(mapData).length > 0) {
      // Get the top 3 states by company count
      const topStates = Object.entries(mapData)
        .sort(([, a]: [string, any], [, b]: [string, any]) => b.count - a.count)
        .slice(0, 3)
        .map(([id]) => id);

      setSelectedStates(topStates);
    }
  }, [mapData]);

  const handleStateToggle = (stateId: string) => {
    if (selectedStates.includes(stateId)) {
      setSelectedStates(selectedStates.filter(id => id !== stateId));
    } else {
      if (selectedStates.length < 4) {
        setSelectedStates([...selectedStates, stateId]);
      }
    }
  };

  // Get state data sorted by selected metric
  const getSortedStateData = () => {
    const states = Object.entries(mapData)
      .map(([id, data]: [string, any]) => ({ id, ...data }))
      .sort((a, b) => {
        if (compareMetric === 'companies') return b.count - a.count;
        if (compareMetric === 'density') return b.density - a.density;
        if (compareMetric === 'growth') return b.growthRate - a.growthRate;
        return 0;
      });
    return states;
  };

  // Get the maximum value for the selected metric
  const getMaxValue = (metric: string) => {
    if (!mapData || Object.keys(mapData).length === 0) return 0;

    return Math.max(
      ...Object.values(mapData).map((state: any) => {
        if (metric === 'companies') return state.count;
        if (metric === 'density') return state.density;
        if (metric === 'growth') return state.growthRate;
        return 0;
      })
    );
  };

  // Render comparison bar for a state
  const renderComparisonBar = (stateId: string) => {
    if (!mapData[stateId]) return null;

    const state = mapData[stateId];
    const maxValue = getMaxValue(compareMetric);

    let value = 0;
    let label = '';
    let percentage = 0;

    if (compareMetric === 'companies') {
      value = state.count;
      label = `${value} companies`;
      percentage = (value / maxValue) * 100;
    } else if (compareMetric === 'density') {
      value = state.density;
      label = `${value.toFixed(1)} per 10,000 km²`;
      percentage = (value / maxValue) * 100;
    } else if (compareMetric === 'growth') {
      value = state.growthRate;
      label = `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
      // For growth, we need to handle negative values
      const absMaxValue = Math.max(Math.abs(maxValue), 25); // Cap at reasonable value
      percentage = ((value + 10) / (absMaxValue + 10)) * 100; // Shift to handle negatives
    }

    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{state.name}</span>
          <span className="text-sm text-gray-600">{label}</span>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              compareMetric === 'growth' && value < 0
                ? 'bg-red-400'
                : 'bg-qxnet'
            }`}
            style={{ width: `${Math.max(percentage, 3)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold">
            State Comparison
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Select states to compare (max 4)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(stateNames).map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => handleStateToggle(id)}
                  className={`px-3 py-2 text-sm border rounded transition-colors ${
                    selectedStates.includes(id)
                      ? 'border-qxnet bg-qxnet-50 text-qxnet-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Compare by</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCompareMetric('companies')}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center ${
                  compareMetric === 'companies'
                    ? 'bg-qxnet text-black'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <BarChart2 size={14} className="mr-1.5" />
                Company Count
              </button>
              <button
                onClick={() => setCompareMetric('density')}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center ${
                  compareMetric === 'density'
                    ? 'bg-qxnet text-black'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <PieChart size={14} className="mr-1.5" />
                Company Density
              </button>
              <button
                onClick={() => setCompareMetric('growth')}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center ${
                  compareMetric === 'growth'
                    ? 'bg-qxnet text-black'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <ArrowUpRight size={14} className="mr-1.5" />
                Growth Rate
              </button>
            </div>
          </div>

          {/* Comparison chart */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium mb-4">
              {compareMetric === 'companies' && 'Company Count Comparison'}
              {compareMetric === 'density' && 'Company Density Comparison'}
              {compareMetric === 'growth' && 'Growth Rate Comparison'}
            </h4>

            {selectedStates.length > 0 ? (
              selectedStates.map(stateId => renderComparisonBar(stateId))
            ) : (
              <div className="text-center py-6 text-gray-500">
                Select states to compare their {compareMetric}
              </div>
            )}
          </div>

          {/* Rankings table */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              State Rankings by {compareMetric === 'companies' ? 'Company Count' :
                              compareMetric === 'density' ? 'Company Density' : 'Growth Rate'}
            </h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {compareMetric === 'companies' ? 'Companies' :
                       compareMetric === 'density' ? 'Density' : 'Growth Rate'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getSortedStateData().map((state: any, index) => (
                    <tr
                      key={state.id}
                      className={selectedStates.includes(state.id) ? 'bg-qxnet-50' : ''}
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        {state.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                        {compareMetric === 'companies' && state.count}
                        {compareMetric === 'density' && `${state.density.toFixed(1)}`}
                        {compareMetric === 'growth' && (
                          <span className={state.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {state.growthRate >= 0 ? '+' : ''}{state.growthRate.toFixed(1)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Compare states based on different metrics
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-qxnet text-black rounded hover:bg-qxnet-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StateComparisonModal;
