"use client";

import React from "react";
import { StatisticsCounter } from "./StatisticsCounter";

export function StatisticsSection() {
  // Statistics data
  const statisticsData = [
    { value: "54,657", label: "Companies" },
    { value: "8", label: "States & Territories" },
    { value: "35+", label: "Industries" }
  ];

  return (
    <section className="pt-0 pb-10 bg-gradient-to-b from-white to-qxnet-50">
      <div className="container">
        <StatisticsCounter items={statisticsData} className="mt-0 mb-8" />
      </div>
    </section>
  );
} 