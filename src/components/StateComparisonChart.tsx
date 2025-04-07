"use client";

import React, { useState, useEffect } from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart } from 'recharts';
import { companiesData } from '@/data/companiesData';

type Industry = 'web-development' | 'mobile-development' | 'design' | 'marketing' | 'ecommerce' | 'software' | 'consulting' | 'ai' | 'saas';

// Map industry IDs to display names
const industryNames: Record<Industry, string> = {
  'web-development': 'Web Dev',
  'mobile-development': 'Mobile Dev',
  'design': 'Design',
  'marketing': 'Marketing',
  'ecommerce': 'E-commerce',
  'software': 'Software',
  'consulting': 'Consulting',
  'ai': 'AI & ML',
  'saas': 'SaaS'
};

// Define colors for different states
const stateColors: Record<string, string> = {
  'new-south-wales': '#4299E1', // Blue
  'victoria': '#48BB78', // Green
  'queensland': '#ED8936', // Orange
  'western-australia': '#9F7AEA', // Purple
  'south-australia': '#F56565', // Red
  'australian-capital-territory': '#4FD1C5', // Teal
  'tasmania': '#667EEA', // Indigo
  'northern-territory': '#F6AD55', // Light Orange
};

// State names for display
const stateDisplayNames: Record<string, string> = {
  'new-south-wales': 'NSW',
  'victoria': 'VIC',
  'queensland': 'QLD',
  'western-australia': 'WA',
  'south-australia': 'SA',
  'australian-capital-territory': 'ACT',
  'tasmania': 'TAS',
  'northern-territory': 'NT',
};

interface StateComparisonChartProps {
  states: string[];
  comparisonType: 'industry' | 'size' | 'growth' | 'projects';
}

export default function StateComparisonChart({ states, comparisonType }: StateComparisonChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Transform company data into chart format
  useEffect(() => {
    setLoading(true);

    if (comparisonType === 'industry') {
      // Create data structure for industry comparison
      const industries = Object.keys(industryNames) as Industry[];
      const chartData = industries.map(industry => {
        const dataPoint: Record<string, any> = {
          name: industryNames[industry]
        };

        states.forEach(stateId => {
          // Count companies with this industry in this state
          const count = companiesData.filter(company => {
            const matchesState =
              (stateId === 'new-south-wales' && (company.location.includes('Sydney') || company.location.includes('New South Wales'))) ||
              (stateId === 'victoria' && (company.location.includes('Melbourne') || company.location.includes('Victoria'))) ||
              (stateId === 'queensland' && (company.location.includes('Brisbane') || company.location.includes('Queensland'))) ||
              (stateId === 'western-australia' && (company.location.includes('Perth') || company.location.includes('Western Australia'))) ||
              (stateId === 'south-australia' && (company.location.includes('Adelaide') || company.location.includes('South Australia'))) ||
              (stateId === 'tasmania' && (company.location.includes('Hobart') || company.location.includes('Tasmania'))) ||
              (stateId === 'northern-territory' && (company.location.includes('Darwin') || company.location.includes('Northern Territory'))) ||
              (stateId === 'australian-capital-territory' && (company.location.includes('Canberra') || company.location.includes('ACT')));

            const matchesIndustry = company.services?.some(service =>
              service.toLowerCase().includes(industry.replace('-', ' '))
            );

            return matchesState && matchesIndustry;
          }).length;

          dataPoint[stateDisplayNames[stateId]] = count;
        });

        return dataPoint;
      });

      setData(chartData);
    } else if (comparisonType === 'size') {
      // Company size comparison - simulate with 3 size categories
      const sizes = ['Small (1-50)', 'Medium (51-200)', 'Large (201+)'];
      const chartData = sizes.map(size => {
        const dataPoint: Record<string, any> = {
          name: size
        };

        states.forEach(stateId => {
          // Simulate company counts by size category based on state size
          const stateCompanies = companiesData.filter(company => {
            return (stateId === 'new-south-wales' && (company.location.includes('Sydney') || company.location.includes('New South Wales'))) ||
              (stateId === 'victoria' && (company.location.includes('Melbourne') || company.location.includes('Victoria'))) ||
              (stateId === 'queensland' && (company.location.includes('Brisbane') || company.location.includes('Queensland'))) ||
              (stateId === 'western-australia' && (company.location.includes('Perth') || company.location.includes('Western Australia'))) ||
              (stateId === 'south-australia' && (company.location.includes('Adelaide') || company.location.includes('South Australia'))) ||
              (stateId === 'tasmania' && (company.location.includes('Hobart') || company.location.includes('Tasmania'))) ||
              (stateId === 'northern-territory' && (company.location.includes('Darwin') || company.location.includes('Northern Territory'))) ||
              (stateId === 'australian-capital-territory' && (company.location.includes('Canberra') || company.location.includes('ACT')));
          });

          // Distribute companies into size categories with realistic weights
          if (size === 'Small (1-50)') {
            dataPoint[stateDisplayNames[stateId]] = Math.round(stateCompanies.length * 0.7);
          } else if (size === 'Medium (51-200)') {
            dataPoint[stateDisplayNames[stateId]] = Math.round(stateCompanies.length * 0.2);
          } else {
            dataPoint[stateDisplayNames[stateId]] = Math.round(stateCompanies.length * 0.1);
          }
        });

        return dataPoint;
      });

      setData(chartData);
    } else if (comparisonType === 'growth') {
      // Growth rate comparison - simulate with growth categories
      const growthRates = ['Declining', 'Stable', 'Growing', 'High Growth'];
      const chartData = growthRates.map(rate => {
        const dataPoint: Record<string, any> = {
          name: rate
        };

        states.forEach(stateId => {
          const stateCompanies = companiesData.filter(company => {
            return (stateId === 'new-south-wales' && (company.location.includes('Sydney') || company.location.includes('New South Wales'))) ||
              (stateId === 'victoria' && (company.location.includes('Melbourne') || company.location.includes('Victoria'))) ||
              (stateId === 'queensland' && (company.location.includes('Brisbane') || company.location.includes('Queensland'))) ||
              (stateId === 'western-australia' && (company.location.includes('Perth') || company.location.includes('Western Australia'))) ||
              (stateId === 'south-australia' && (company.location.includes('Adelaide') || company.location.includes('South Australia'))) ||
              (stateId === 'tasmania' && (company.location.includes('Hobart') || company.location.includes('Tasmania'))) ||
              (stateId === 'northern-territory' && (company.location.includes('Darwin') || company.location.includes('Northern Territory'))) ||
              (stateId === 'australian-capital-territory' && (company.location.includes('Canberra') || company.location.includes('ACT')));
          });

          // Simulate growth distribution with weighted random allocation
          const total = stateCompanies.length;
          if (rate === 'Declining') {
            dataPoint[stateDisplayNames[stateId]] = Math.round(total * 0.1);
          } else if (rate === 'Stable') {
            dataPoint[stateDisplayNames[stateId]] = Math.round(total * 0.35);
          } else if (rate === 'Growing') {
            dataPoint[stateDisplayNames[stateId]] = Math.round(total * 0.4);
          } else {
            dataPoint[stateDisplayNames[stateId]] = Math.round(total * 0.15);
          }
        });

        return dataPoint;
      });

      setData(chartData);
    } else {
      // Projects count comparison - simulate with project count ranges
      const projectRanges = ['0-10', '11-50', '51-100', '100+'];
      const chartData = projectRanges.map(range => {
        const dataPoint: Record<string, any> = {
          name: range
        };

        states.forEach(stateId => {
          const stateCompanies = companiesData.filter(company => {
            return (stateId === 'new-south-wales' && (company.location.includes('Sydney') || company.location.includes('New South Wales'))) ||
              (stateId === 'victoria' && (company.location.includes('Melbourne') || company.location.includes('Victoria'))) ||
              (stateId === 'queensland' && (company.location.includes('Brisbane') || company.location.includes('Queensland'))) ||
              (stateId === 'western-australia' && (company.location.includes('Perth') || company.location.includes('Western Australia'))) ||
              (stateId === 'south-australia' && (company.location.includes('Adelaide') || company.location.includes('South Australia'))) ||
              (stateId === 'tasmania' && (company.location.includes('Hobart') || company.location.includes('Tasmania'))) ||
              (stateId === 'northern-territory' && (company.location.includes('Darwin') || company.location.includes('Northern Territory'))) ||
              (stateId === 'australian-capital-territory' && (company.location.includes('Canberra') || company.location.includes('ACT')));
          });

          const total = stateCompanies.length;
          if (range === '0-10') {
            dataPoint[stateDisplayNames[stateId]] = Math.round(total * 0.3);
          } else if (range === '11-50') {
            dataPoint[stateDisplayNames[stateId]] = Math.round(total * 0.4);
          } else if (range === '51-100') {
            dataPoint[stateDisplayNames[stateId]] = Math.round(total * 0.2);
          } else {
            dataPoint[stateDisplayNames[stateId]] = Math.round(total * 0.1);
          }
        });

        return dataPoint;
      });

      setData(chartData);
    }

    setLoading(false);
  }, [states, comparisonType]);

  const getChartTitle = () => {
    switch (comparisonType) {
      case 'industry':
        return 'Industry Distribution';
      case 'size':
        return 'Company Size Distribution';
      case 'growth':
        return 'Company Growth Rate';
      case 'projects':
        return 'Number of Projects';
      default:
        return 'Comparison';
    }
  };

  // Generate chart colors based on selected states
  const chartColors = states.map(stateId => stateColors[stateId]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-10 h-10 border-t-2 border-qxnet rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="font-medium text-lg mb-4">{getChartTitle()} by State</h3>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {states.map((stateId, index) => (
              <Bar
                key={stateId}
                dataKey={stateDisplayNames[stateId]}
                fill={chartColors[index]}
                name={stateDisplayNames[stateId]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
