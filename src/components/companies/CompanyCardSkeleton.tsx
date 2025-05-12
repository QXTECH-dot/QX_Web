import React from "react";
import { Card } from "@/components/ui/card";

export function CompanyCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full border border-gray-200 animate-pulse">
      <div className="p-6">
        <div className="flex items-start">
          {/* Logo Placeholder */}
          <div className="relative w-16 h-16 rounded bg-gray-300 mr-4 flex-shrink-0"></div>

          {/* Info Placeholder */}
          <div className="flex-1 min-w-0">
            {/* Name Placeholder */}
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
            {/* Location Placeholder */}
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>
            {/* Industry Placeholder */}
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>

        {/* Description Placeholder */}
        <div className="h-[4.5rem] my-6 space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>

        {/* Languages Placeholder */}
        <div className="mb-4">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-[2.5rem]">
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>

        {/* Services Placeholder */}
        <div className="mb-6">
          <div className="h-4 bg-gray-300 rounded w-1/5 mb-2"></div>
          <div className="flex flex-wrap gap-2 h-[5.5rem] overflow-hidden">
            <div className="bg-gray-300 px-4 py-2 rounded text-sm h-9 w-24"></div>
            <div className="bg-gray-300 px-4 py-2 rounded text-sm h-9 w-28"></div>
            <div className="bg-gray-300 px-4 py-2 rounded text-sm h-9 w-20"></div>
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Action Buttons Placeholder */}
        <div className="flex justify-between gap-2">
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
          <div className="w-32 h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    </Card>
  );
} 