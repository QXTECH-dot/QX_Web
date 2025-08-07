"use client";

import React from "react";
import { TabWizardNavProps } from "../types";

export function TabWizardNav({
  currentStep,
  completedSteps,
  onTabClick,
}: TabWizardNavProps) {
  const tabs = [
    { id: 0, label: "About Company", icon: "🏢" },
    { id: 1, label: "Services", icon: "🛠️" },
    { id: 2, label: "Company History", icon: "📅" },
    { id: 3, label: "Office Locations", icon: "📍" },
  ];

  return (
    <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => {
        const isActive = currentStep === tab.id;
        const isCompleted = completedSteps[tab.id];
        const isClickable = isCompleted || tab.id <= currentStep;

        return (
          <button
            key={tab.id}
            onClick={() => isClickable && onTabClick(tab.id)}
            disabled={!isClickable}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isActive
                ? "bg-white text-primary shadow-sm"
                : isCompleted
                ? "text-green-600 hover:text-green-700"
                : isClickable
                ? "text-gray-600 hover:text-gray-700"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            {isCompleted && (
              <svg
                className="w-4 h-4 ml-2 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
