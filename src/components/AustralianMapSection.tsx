"use client";

import React, { useState } from "react";
import { AustralianMap } from "./AustralianMap"; // Use the main component which now uses our React 18.3.1 implementation
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

export function AustralianMapSection() {
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // Handle industry change
  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-qxnet-50 to-white">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Companies in Australia
          </h2>
        </div>

        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md border border-qxnet-100">
          {/* Use the main AustralianMap component which now includes our React 18.3.1 implementation */}
          <AustralianMap
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={handleIndustryChange}
          />
        </div>
      </div>
    </section>
  );
}
