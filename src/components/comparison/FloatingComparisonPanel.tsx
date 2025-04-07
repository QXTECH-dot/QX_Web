"use client";

import React from 'react';
import { useComparison } from './ComparisonContext';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface FloatingComparisonPanelProps {
  isFixedPanel?: boolean;
}

export function FloatingComparisonPanel({ isFixedPanel = true }: FloatingComparisonPanelProps) {
  const {
    selectedCompanies,
    removeFromComparison,
    comparisonCount,
    clearComparison
  } = useComparison();

  // Fixed floating panel for mobile devices
  if (isFixedPanel) {
    return (
      <div className="fixed right-0 top-32 z-50 w-64 bg-white rounded-l-lg shadow-lg border border-r-0 border-gray-200 overflow-hidden transition-all duration-300 ease-in-out md:hidden">
        <div className="bg-primary-50 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Companies Selected</h3>
            {selectedCompanies.length > 0 && (
              <button
                onClick={clearComparison}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Clear all companies"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {comparisonCount}/4 Companies Selected
          </p>
        </div>

        <div className="p-4">
          {selectedCompanies.length > 0 ? (
            <div className="space-y-3 mb-4">
              {selectedCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden mr-2 flex-shrink-0">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium truncate max-w-[120px]">
                      {company.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromComparison(company.id)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label={`Remove ${company.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Plus className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500 mb-4">No companies selected</p>
              <Link href="/companies">
                <Button variant="outline" size="sm" className="w-full">
                  Add Companies
                </Button>
              </Link>
            </div>
          )}

          {comparisonCount >= 2 && (
            <Link href="/companies/compare" className="w-full">
              <Button
                className="w-full bg-primary text-white"
                size="sm"
              >
                Compare Now
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          )}

          {comparisonCount === 1 && (
            <p className="text-xs text-center text-muted-foreground">
              Add at least one more company to compare
            </p>
          )}
        </div>
      </div>
    );
  }

  // Side panel layout for desktop
  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Companies Selected</h3>
          {selectedCompanies.length > 0 && (
            <button
              onClick={clearComparison}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              aria-label="Clear all companies"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {comparisonCount}/4 Companies Selected
        </p>
      </div>

      <div className="p-4 flex-grow overflow-auto">
        {selectedCompanies.length > 0 ? (
          <div className="space-y-4 mb-6">
            {selectedCompanies.map((company) => (
              <div key={company.id} className="bg-gray-50 rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-sm truncate max-w-[120px]">
                      {company.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromComparison(company.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200"
                    aria-label={`Remove ${company.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {company.location}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Plus className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500 mb-4">No companies selected yet</p>
            <Link href="/companies">
              <Button variant="outline" size="sm" className="w-full">
                Add Companies
              </Button>
            </Link>
          </div>
        )}

        {comparisonCount >= 2 ? (
          <Link href="/companies/compare" className="w-full block">
            <Button
              className="w-full bg-primary text-white"
              size="default"
            >
              Compare Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : selectedCompanies.length === 1 && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm">
            <p className="text-center text-amber-700 font-medium mb-1">
              Need More Companies
            </p>
            <p className="text-xs text-center text-amber-600">
              Add at least one more company to enable comparison
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
