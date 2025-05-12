"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useComparison } from './ComparisonContext';
import { ChevronUp } from 'lucide-react';

export function CompareButton() {
  const { selectedCompanies, comparisonCount, showCompareButton, clearComparison } = useComparison();
  const router = useRouter();

  if (!showCompareButton) return null;

  const handleCompare = () => {
    router.push('/companies/compare');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 py-3 px-4">
      <div className="container max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-semibold mr-2">
            {comparisonCount} {comparisonCount === 1 ? 'Company' : 'Companies'} Selected
          </span>
          <span className="text-sm text-gray-500">
            {comparisonCount < 4 ? `(Add up to ${4 - comparisonCount} more)` : '(Maximum reached)'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearComparison}
          >
            Clear All
          </Button>

          <Button
            size="sm"
            className="bg-primary text-white px-6"
            onClick={handleCompare}
          >
            Compare
            <ChevronUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
