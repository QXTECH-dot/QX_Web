"use client";

import React from "react";
import { History } from "lucide-react";
import { HistoryEventType } from "../types";

interface HistoryTabProps {
  history: HistoryEventType[];
  loading: boolean;
  error: string | null;
}

export function HistoryTab({ history, loading, error }: HistoryTabProps) {
  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Company History & Milestones</h2>
        <div className="text-center py-6">
          <p className="text-muted-foreground">Loading company history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Company History & Milestones</h2>
        <div className="text-center py-6">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Company History & Milestones</h2>
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">
            No history information available for this company.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Company History & Milestones</h2>
      <div className="relative border-l-2 border-primary/20 pl-8 ml-4 space-y-10">
        {history.map((item, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
              <History className="h-3 w-3 text-white" />
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-1">
                {item.year}
              </h3>
              <p className="text-muted-foreground">{item.event}</p>
            </div>
          </div>
        ))}
        <div className="absolute -left-[10px] bottom-0 h-5 w-5 rounded-full bg-primary"></div>
      </div>
    </div>
  );
}
