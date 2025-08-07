"use client";

import React from "react";
import { Company } from "./types";

interface CompanyTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  company: Company;
}

export function CompanyTabNavigation({
  activeTab,
  onTabChange,
  company,
}: CompanyTabNavigationProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "history", label: "Company History" },
    {
      id: "reviews",
      label: `Reviews ${company.reviews ? `(${company.reviews.length})` : ""}`,
    },
    { id: "contact", label: "Get in Touch" },
  ];

  return (
    <div className="border-b mb-6 sm:mb-8">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 sm:px-4 py-2 font-medium border-b-2 text-sm sm:text-base whitespace-nowrap ${
              activeTab === tab.id
                ? tab.id === "contact"
                  ? "border-primary text-primary bg-primary/20 rounded-t-lg font-semibold"
                  : "border-primary text-primary"
                : tab.id === "contact"
                ? "border-transparent text-primary bg-primary/10 hover:bg-primary/15 rounded-t-lg"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
