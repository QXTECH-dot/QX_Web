"use client";

import React from "react";
import { StepProgressProps } from "../types";

export function StepProgress({ currentStep }: StepProgressProps) {
  const steps = [
    { name: "About Company", description: "Basic company information" },
    { name: "Services", description: "Services offered" },
    { name: "Company History", description: "Key milestones" },
    { name: "Office Locations", description: "Office details" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index < currentStep
                  ? "bg-primary border-primary text-white"
                  : index === currentStep
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {index < currentStep ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  index < currentStep ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {steps[currentStep]?.name}
        </h3>
        <p className="text-sm text-gray-600">
          {steps[currentStep]?.description}
        </p>
      </div>
    </div>
  );
}
