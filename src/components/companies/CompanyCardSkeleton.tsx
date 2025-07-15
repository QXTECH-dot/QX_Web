import React from "react";
import { Card } from "@/components/ui/card";

export function CompanyCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full border border-gray-200 relative company-card">
      {/* Comparison checkbox placeholder */}
      <div className="absolute top-4 right-4 z-10">
        <div className="w-6 h-6 rounded border bg-gray-200 animate-pulse"></div>
      </div>

      <div className="p-6">
        <div className="flex items-start">
          {/* Company Logo Placeholder - 精确匹配实际尺寸 */}
          <div className="w-28 h-20 bg-gray-200 rounded mr-4 flex-shrink-0 animate-pulse"></div>

          {/* Company Info Placeholder */}
          <div className="flex-1 min-w-0">
            {/* Company Name - 匹配3.5rem高度 */}
            <div className="h-[3.5rem] flex flex-col justify-start mb-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>

            {/* Location with icon */}
            <div className="flex items-center mb-1">
              <div className="h-4 w-4 bg-gray-200 rounded mr-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>

            {/* ABN */}
            <div className="flex items-center mb-1">
              <div className="h-4 w-4 bg-gray-200 rounded mr-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/5 animate-pulse"></div>
            </div>

            {/* Industry */}
            <div className="flex items-center mb-1">
              <div className="h-4 w-4 bg-gray-200 rounded mr-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Description - 精确匹配4.5rem高度 */}
        <div className="h-[4.5rem] my-6 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
        </div>

        {/* Languages */}
        <div className="mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-[2.5rem]">
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>

        {/* Services - 精确匹配5.5rem高度 */}
        <div className="mb-6">
          <div className="h-5 bg-gray-200 rounded w-1/5 mb-2 animate-pulse"></div>
          <div className="flex flex-wrap gap-2 h-[5.5rem] overflow-hidden">
            <div className="bg-gray-200 px-4 py-2 rounded text-sm h-9 w-24 animate-pulse"></div>
            <div className="bg-gray-200 px-4 py-2 rounded text-sm h-9 w-28 animate-pulse"></div>
            <div className="bg-gray-200 px-4 py-2 rounded text-sm h-9 w-20 animate-pulse"></div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Action Buttons */}
        <div className="flex justify-between gap-2">
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </Card>
  );
} 