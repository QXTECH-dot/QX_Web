"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { MapLoader } from "./MapLoader";
import { AustralianMapFallback } from "./AustralianMapFallback";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Use dynamic import with a proper error boundary for the AustralianMap component
const AustralianMap = dynamic(
  () => import("./AustralianMap").then(mod => mod.AustralianMap),
  {
    ssr: false,
    loading: () => <MapLoader />,
  }
);

export function AustralianMapSection() {
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // Handle any errors that might occur when rendering the map
  useEffect(() => {
    setIsClient(true);

    // Add a global error handler for SVG map loading issues
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('SVGMap') ||
          event.message.includes('australia') ||
          event.message.includes('@svg-maps')) {
        console.error('Caught map loading error:', event);
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Handle industry change
  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-qxnet-50 to-white">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Companies Across Australia
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore businesses across Australian states and territories. Find tech companies in your region and discover the perfect match for your project.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md border border-qxnet-100">
          {!isClient ? (
            // Show a loading state during server-side rendering
            <div className="h-96 flex items-center justify-center">
              <div className="animate-pulse w-24 h-24 rounded-full bg-qxnet-100"></div>
            </div>
          ) : hasError ? (
            // Show the fallback if there's an error
            <AustralianMapFallback
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={handleIndustryChange}
            />
          ) : (
            // Show the actual map
            <AustralianMap
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={handleIndustryChange}
            />
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Our interactive map shows the distribution of businesses from all industries across Australia.
          </p>
          <Link
            href="/companies"
            className="inline-flex items-center text-qxnet-600 hover:text-qxnet-700 font-medium"
          >
            View all companies in Australia
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Industry quick links */}
        <div className="mt-12">
          <h3 className="text-center text-lg font-semibold mb-6">Popular Industries</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <Link
              href="/companies?industry=web-development"
              className="px-4 py-3 bg-white rounded-md border border-gray-200 hover:border-qxnet hover:shadow-sm transition-all text-center"
            >
              Web Development
            </Link>
            <Link
              href="/companies?industry=mobile-development"
              className="px-4 py-3 bg-white rounded-md border border-gray-200 hover:border-qxnet hover:shadow-sm transition-all text-center"
            >
              Mobile Development
            </Link>
            <Link
              href="/companies?industry=design"
              className="px-4 py-3 bg-white rounded-md border border-gray-200 hover:border-qxnet hover:shadow-sm transition-all text-center"
            >
              Design & UI/UX
            </Link>
            <Link
              href="/companies?industry=marketing"
              className="px-4 py-3 bg-white rounded-md border border-gray-200 hover:border-qxnet hover:shadow-sm transition-all text-center"
            >
              Digital Marketing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
