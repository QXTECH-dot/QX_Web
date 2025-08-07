"use client";

import React from "react";

interface ProgressBarProps {
  company: any;
}

export function ProgressBar({ company }: ProgressBarProps) {
  // Calculate completion percentage
  const calculateCompletion = (company: any) => {
    if (!company) return 0;

    const fields = [
      company.name,
      company.industry,
      company.website,
      company.email,
      company.phone,
      company.shortDescription,
      company.fullDescription,
      company.logo,
      company.languages && company.languages.length > 0,
      company.offices && company.offices.length > 0,
      company.services && company.services.length > 0,
      company.history && company.history.length > 0,
    ];

    const completedFields = fields.filter(
      (field) => field !== null && field !== undefined && field !== ""
    ).length;

    return Math.round((completedFields / fields.length) * 100);
  };

  const completionPercent = calculateCompletion(company);

  return (
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1">
        Profile Completion
      </label>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-primary h-4 rounded-full transition-all duration-300"
          style={{ width: `${completionPercent}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500 mt-1">
        {completionPercent}%
      </div>
    </div>
  );
}
