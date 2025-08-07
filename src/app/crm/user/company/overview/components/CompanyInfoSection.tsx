"use client";

import React from "react";

interface CompanyInfoSectionProps {
  company: any;
}

export function CompanyInfoSection({ company }: CompanyInfoSectionProps) {
  return (
    <div className="bg-gray-50 border-l-4 border-gray-400 rounded shadow p-6 mb-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Company Registration Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Company Name
          </label>
          <div className="text-base font-semibold text-gray-800">
            {company.name || "N/A"}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            ABN
          </label>
          <div className="text-base font-mono text-gray-800">
            {company.abn || "N/A"}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Founded Year
          </label>
          <div className="text-base text-gray-800">
            {company.foundedYear || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
