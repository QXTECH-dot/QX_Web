"use client";

import React from 'react';
import { useComparison } from './ComparisonContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function parseTeamSize(size: string | undefined): number {
  if (!size) return 0;

  // Parse ranges like "50-100", "10-50", etc.
  if (size.includes('-')) {
    const [min, max] = size.split('-').map(Number);
    return (min + max) / 2; // Use average of min and max
  }

  // Parse "500+" format
  if (size.includes('+')) {
    return parseInt(size.replace('+', ''));
  }

  return parseInt(size);
}

function parseHourlyRate(rate: string | undefined): number {
  if (!rate) return 0;

  // Parse ranges like "$25-$49/hr", "$100-$149/hr", etc.
  const matches = rate.match(/\$(\d+)-\$(\d+)\/hr/);
  if (matches && matches.length >= 3) {
    const min = parseInt(matches[1]);
    const max = parseInt(matches[2]);
    return (min + max) / 2; // Use average of min and max
  }

  // Parse "$200+/hr" format
  const plusMatches = rate.match(/\$(\d+)\+\/hr/);
  if (plusMatches && plusMatches.length >= 2) {
    return parseInt(plusMatches[1]);
  }

  return 0;
}

function getCompanyColor(index: number): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
  ];

  return colors[index % colors.length];
}

export function ComparisonCharts() {
  const { selectedCompanies } = useComparison();

  // Only show charts if there are at least 2 companies
  if (selectedCompanies.length < 2) {
    return null;
  }

  // Prepare data for team size chart
  const teamSizes = selectedCompanies.map(company => parseTeamSize(company.teamSize));
  const maxTeamSize = Math.max(...teamSizes);

  // Prepare data for hourly rate chart
  const hourlyRates = selectedCompanies.map(company => parseHourlyRate(company.hourlyRate));
  const maxHourlyRate = Math.max(...hourlyRates);

  // Set chart bars to % of max to make them comparable
  const teamSizePercentages = teamSizes.map(size =>
    maxTeamSize === 0 ? 0 : (size / maxTeamSize) * 100
  );

  const hourlyRatePercentages = hourlyRates.map(rate =>
    maxHourlyRate === 0 ? 0 : (rate / maxHourlyRate) * 100
  );

  return (
    <div className="mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visual Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Team Size Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Team Size Comparison</h3>
            <div className="space-y-6">
              {selectedCompanies.map((company, index) => (
                <div key={`team-size-${company.id}`} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {company.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {company.teamSize || 'N/A'}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCompanyColor(index)} rounded-full`}
                      style={{ width: `${teamSizePercentages[index]}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Rate Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hourly Rate Comparison</h3>
            <div className="space-y-6">
              {selectedCompanies.map((company, index) => (
                <div key={`hourly-rate-${company.id}`} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {company.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {company.hourlyRate || 'N/A'}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCompanyColor(index)} rounded-full`}
                      style={{ width: `${hourlyRatePercentages[index]}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
