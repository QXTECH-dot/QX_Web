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
            Interactive Map of Tech Companies Across Australia
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore businesses across Australian states and territories. Find tech companies in your region,
            view real-time data, and discover the perfect match for your project.
          </p>
          <div className="flex items-center justify-center mt-3 text-sm text-gray-500">
            <Info className="h-4 w-4 mr-1.5 text-qxnet-400" />
            <span>Now with React 18.3.1 SVG implementation, real-time data, and state comparison!</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md border border-qxnet-100">
          {/* Use the main AustralianMap component which now includes our React 18.3.1 implementation */}
          <AustralianMap
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={handleIndustryChange}
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Our interactive map shows the distribution of businesses across Australia with real-time data updates.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link
              href="/companies"
              className="inline-flex items-center text-qxnet-600 hover:text-qxnet-700 font-medium"
            >
              View all companies
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSelectedIndustry("web-development")}
              className="text-qxnet-600 hover:text-qxnet-700 font-medium"
            >
              Web Development Companies
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSelectedIndustry("mobile-development")}
              className="text-qxnet-600 hover:text-qxnet-700 font-medium"
            >
              Mobile Development
            </button>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-qxnet-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-qxnet-700 font-bold text-xl">🔍</span>
            </div>
            <h3 className="font-medium mb-2">Company Search</h3>
            <p className="text-sm text-gray-600">Find specific companies across Australia with our powerful search function</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-qxnet-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-qxnet-700 font-bold text-xl">📊</span>
            </div>
            <h3 className="font-medium mb-2">State Comparison</h3>
            <p className="text-sm text-gray-600 mb-3">Compare states based on industry concentration and company metrics</p>
            <Link
              href="/state-comparison"
              className="text-xs text-qxnet-600 hover:text-qxnet-700 inline-flex items-center"
            >
              Advanced comparison tool
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-qxnet-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-qxnet-700 font-bold text-xl">🔥</span>
            </div>
            <h3 className="font-medium mb-2">Interactive SVG Map</h3>
            <p className="text-sm text-gray-600">Built with React 18.3.1 for smooth interactions and dynamic updates</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-qxnet-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-qxnet-700 font-bold text-xl">📱</span>
            </div>
            <h3 className="font-medium mb-2">Mobile Friendly</h3>
            <p className="text-sm text-gray-600">Explore the Australian tech landscape from any device with touch-friendly controls</p>
          </div>
        </div>
      </div>
    </section>
  );
}
