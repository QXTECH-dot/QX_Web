"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Filter } from 'lucide-react';

export type ComparisonFilterCategory =
  | 'all'
  | 'basic'
  | 'financial'
  | 'services'
  | 'technical'
  | 'differences'
  | 'similarities';

interface ComparisonFilterProps {
  activeFilter: ComparisonFilterCategory;
  onFilterChange: (filter: ComparisonFilterCategory) => void;
  highlightDifferences: boolean;
  onToggleHighlight: () => void;
}

interface FilterOption {
  id: ComparisonFilterCategory;
  label: string;
  description?: string;
}

const filterOptions: FilterOption[] = [
  { id: 'all', label: 'All Features' },
  { id: 'basic', label: 'Basic Info', description: 'Location, Industry, Team Size' },
  { id: 'financial', label: 'Financial', description: 'Hourly Rate, Project Size' },
  { id: 'services', label: 'Services', description: 'Offered Services' },
  { id: 'technical', label: 'Technical', description: 'Technical Capabilities' },
  { id: 'differences', label: 'Show Differences', description: 'Only show features that differ' },
  { id: 'similarities', label: 'Show Similarities', description: 'Only show features that match' },
];

export function ComparisonFilter({
  activeFilter,
  onFilterChange,
  highlightDifferences,
  onToggleHighlight
}: ComparisonFilterProps) {
  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-primary" />
          <h2 className="font-semibold text-lg">Filter Comparison</h2>
        </div>

        <Button
          variant={highlightDifferences ? "default" : "outline"}
          size="sm"
          onClick={onToggleHighlight}
          className={highlightDifferences ? "bg-primary text-white" : ""}
        >
          {highlightDifferences ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Highlighting Differences
            </>
          ) : (
            "Highlight Differences"
          )}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeFilter === option.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(option.id)}
            className={activeFilter === option.id ? "bg-primary text-white" : ""}
            title={option.description}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
