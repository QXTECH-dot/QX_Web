"use client";

import React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Common industries in Australia
const industries = [
  { id: "all", name: "All Industries" },
  { id: "web-development", name: "Web Development" },
  { id: "mobile-development", name: "Mobile Development" },
  { id: "design", name: "Design & UI/UX" },
  { id: "marketing", name: "Digital Marketing" },
  { id: "ecommerce", name: "E-commerce" },
  { id: "software", name: "Software Development" },
  { id: "consulting", name: "IT Consulting" },
  { id: "ai", name: "AI & Machine Learning" },
  { id: "saas", name: "SaaS" }
];

interface AustralianMapFiltersProps {
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  resetSelection: () => void;
}

export function AustralianMapFilters({
  selectedIndustry,
  setSelectedIndustry,
  resetSelection
}: AustralianMapFiltersProps) {
  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    resetSelection(); // Reset selected state when industry changes
  };

  const currentIndustry = industries.find(i => i.id === selectedIndustry) || industries[0];

  return (
    <div className="mb-4 flex flex-col sm:flex-row items-center justify-between">
      <div className="mb-2 sm:mb-0">
        <p className="text-sm text-gray-500 mb-1">Filter by industry:</p>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:border-qxnet-200 transition-colors text-sm">
            {currentIndustry.name}
            <ChevronDown className="h-4 w-4 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuGroup>
              {industries.map((industry) => (
                <DropdownMenuItem
                  key={industry.id}
                  onClick={() => handleIndustryChange(industry.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{industry.name}</span>
                  {selectedIndustry === industry.id && <Check className="h-4 w-4 text-qxnet" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <p className="text-xs text-gray-400 text-center sm:text-right">
          Click on any state to see companies in that region
        </p>
      </div>
    </div>
  );
}
