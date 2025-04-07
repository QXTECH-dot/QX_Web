"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useComparison } from './ComparisonContext';
import { Company } from '@/types/company';
import Image from 'next/image';
import { Check, Plus, X, ChevronRight } from 'lucide-react';
import { companiesData } from '@/data/companiesData';
import Link from 'next/link';

interface ProfileComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCompany: Company;
}

export function ProfileComparisonModal({
  open,
  onOpenChange,
  currentCompany
}: ProfileComparisonModalProps) {
  const {
    selectedCompanies,
    addToComparison,
    removeFromComparison,
    isInComparison,
    comparisonCount
  } = useComparison();

  // Calculate similar companies (excluding current and already selected)
  const similarCompanies = React.useMemo(() => {
    // Get companies with similar industries or services
    return companiesData
      .filter(company => {
        // Skip current company
        if (company.id === currentCompany.id) return false;

        // Check if they share industry or services
        const sharedIndustries = currentCompany.industries && company.industries ?
          company.industries.some(industry =>
            currentCompany.industries?.includes(industry)
          ) : false;

        const sharedServices = company.services.some(service =>
          currentCompany.services.includes(service)
        );

        // Include if they share industry or at least one service
        return sharedIndustries || sharedServices;
      })
      .sort((a, b) => {
        // Count shared industries as primary sort
        const aSharedIndustries = a.industries && currentCompany.industries ?
          a.industries.filter(i => currentCompany.industries?.includes(i)).length : 0;

        const bSharedIndustries = b.industries && currentCompany.industries ?
          b.industries.filter(i => currentCompany.industries?.includes(i)).length : 0;

        if (aSharedIndustries !== bSharedIndustries) {
          return bSharedIndustries - aSharedIndustries;
        }

        // Count shared services as secondary sort
        const aSharedServices = a.services.filter(s => currentCompany.services.includes(s)).length;
        const bSharedServices = b.services.filter(s => currentCompany.services.includes(s)).length;

        return bSharedServices - aSharedServices;
      })
      .slice(0, 8); // Limit to top 8 similar companies
  }, [currentCompany]);

  const canAddMore = comparisonCount < 4;
  const showCompareNowButton = comparisonCount >= 2;

  const handleToggleCompany = (company: Company) => {
    if (isInComparison(company.id)) {
      removeFromComparison(company.id);
    } else if (canAddMore) {
      addToComparison(company);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Companies</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Selected companies */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Selected Companies ({comparisonCount}/4)</h3>

            {selectedCompanies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedCompanies.map(company => (
                  <div
                    key={company.id}
                    className="flex items-center p-3 rounded-md border bg-gray-50"
                  >
                    <div className="relative w-10 h-10 mr-3 rounded overflow-hidden bg-white">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium line-clamp-1">{company.name}</p>
                      <p className="text-xs text-gray-500">
                        {company.industries ? company.industries.join(', ') : 'Unknown Industry'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-7 w-7"
                      onClick={() => removeFromComparison(company.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Placeholder slots for remaining companies */}
                {Array.from({ length: Math.max(0, 4 - comparisonCount) }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="flex items-center justify-center p-4 rounded-md border border-dashed h-[62px]"
                  >
                    <p className="text-xs text-gray-400">Add more companies to compare</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border rounded-md">
                <p className="text-sm text-gray-500 mb-2">No companies selected yet</p>
                <p className="text-xs text-gray-400">Add companies from the list below to compare</p>
              </div>
            )}
          </div>

          {/* Similar companies */}
          <div>
            <h3 className="text-sm font-medium mb-3">Similar Companies You Might Want to Compare</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {similarCompanies.map(company => {
                const isSelected = isInComparison(company.id);

                return (
                  <div
                    key={company.id}
                    className={`flex items-center p-3 rounded-md border ${
                      isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="relative w-10 h-10 mr-3 rounded overflow-hidden bg-white">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium line-clamp-1">{company.name}</p>
                      <p className="text-xs text-gray-500">
                        {company.industries ? company.industries.join(', ') : 'Unknown Industry'}
                      </p>
                    </div>
                    <Button
                      variant={isSelected ? "outline" : "default"}
                      size="sm"
                      disabled={!isSelected && !canAddMore}
                      onClick={() => handleToggleCompany(company)}
                      className={isSelected ? "border-primary text-primary h-8" : "h-8"}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3 w-3 mr-1" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3 mr-1" /> Add
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          {showCompareNowButton && (
            <Link href="/companies/compare" onClick={() => onOpenChange(false)}>
              <Button variant="default" className="bg-primary text-white">
                Compare Companies
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
