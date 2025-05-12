"use client";

import React, { useState } from 'react';
import { useComparison } from './ComparisonContext';
import { Button } from '@/components/ui/button';
import { Plus, Check, Users } from 'lucide-react';
import { Company } from '@/types/company';
import { ProfileComparisonModal } from './ProfileComparisonModal';

interface ProfileCompareButtonProps {
  company: Company;
}

export function ProfileCompareButton({ company }: ProfileCompareButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    addToComparison,
    removeFromComparison,
    isInComparison,
    comparisonCount
  } = useComparison();

  const isSelected = isInComparison(company.id);
  const canAddMore = comparisonCount < 4;

  const handleToggleComparison = () => {
    if (isSelected) {
      removeFromComparison(company.id);
    } else if (canAddMore) {
      addToComparison(company);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-sm py-8 border-t border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button
              variant={isSelected ? "outline" : "default"}
              onClick={handleToggleComparison}
              disabled={!isSelected && !canAddMore}
              className={isSelected ? "border-primary text-primary" : ""}
            >
              {isSelected ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Added to Comparison
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {canAddMore ? "Add to Comparison" : "Maximum Companies Added"}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setModalOpen(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              Find Companies to Compare
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <ProfileComparisonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentCompany={company}
      />
    </>
  );
}
