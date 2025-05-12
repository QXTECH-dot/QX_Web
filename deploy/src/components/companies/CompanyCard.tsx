"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building, MapPin, CheckCircle, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { HighlightedCompanyName, HighlightedDescription } from "@/components/search/HighlightedResult";
import { useComparison } from "@/components/comparison/ComparisonContext";
import { Company } from "@/types/company";

interface CompanyCardProps {
  id: string;
  name: string;
  logo: string;
  location: string;
  description: string;
  verified?: boolean;
  teamSize?: string;
  hourlyRate?: string;
  services?: string[];
  abn?: string;
  industry?: string;
}

export function CompanyCard({
  id,
  name,
  logo,
  location,
  description,
  verified = false,
  teamSize,
  hourlyRate,
  services = [],
  abn,
  industry
}: CompanyCardProps) {
  // Get search query from URL to highlight matching text
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';

  // Comparison functionality
  const {
    isInComparison,
    addToComparison,
    removeFromComparison,
    comparisonCount
  } = useComparison();

  const inComparison = isInComparison(id);
  const maxReached = comparisonCount >= 4 && !inComparison;

  const toggleComparison = () => {
    if (inComparison) {
      removeFromComparison(id);
    } else if (!maxReached) {
      // Create a company object from props to add to comparison
      const company: Company = {
        id,
        name,
        logo,
        location,
        description,
        verified,
        teamSize,
        hourlyRate,
        services,
        abn,
        industry
      };
      addToComparison(company);
    }
  };

  // Function to render dollar signs for hourly rate
  const renderDollarSigns = (rate: string) => {
    if (!rate) return null;

    // Extract the first character from hourlyRate (assuming it's like "$25-$49/hr")
    const firstDollar = rate.charAt(0);

    // Determine how many dollar signs to show (1-5)
    let dollarCount = 1;
    if (rate.includes("$25-$49")) dollarCount = 1;
    else if (rate.includes("$50-$99")) dollarCount = 2;
    else if (rate.includes("$100-$149")) dollarCount = 3;
    else if (rate.includes("$150-$199")) dollarCount = 4;
    else if (rate.includes("$200+")) dollarCount = 5;

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={index < dollarCount ? "text-primary" : "text-gray-300"}>
            $
          </span>
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full border border-gray-200 relative">
      {/* Comparison checkbox */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className={`w-6 h-6 rounded border flex items-center justify-center
            ${inComparison ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}
            ${maxReached ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}`}
          onClick={toggleComparison}
          disabled={maxReached}
          aria-label={inComparison ? "Remove from comparison" : "Add to comparison"}
          title={maxReached ? "Maximum 4 companies for comparison" : (inComparison ? "Remove from comparison" : "Add to comparison")}
        >
          {inComparison && <Check className="h-4 w-4 text-white" />}
        </button>
      </div>

      {/* Award badge (if applicable) */}
      {verified && (
        <div className="absolute top-4 left-4 bg-orange-400 rounded-full p-2">
          <div className="text-white text-xs font-bold flex items-center justify-center w-5 h-5">
            24
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start">
          {/* Company Logo */}
          <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
            <Image
              src={logo}
              alt={`${name} logo`}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Company Info */}
          <div>
            {/* Use highlighted name for search results */}
            {searchQuery ? (
              <HighlightedCompanyName name={name} query={searchQuery} />
            ) : (
              <h3 className="font-bold text-lg flex items-center">
                {name}
                {verified && (
                  <CheckCircle className="h-5 w-5 text-primary ml-1" fill="white" strokeWidth={2} />
                )}
              </h3>
            )}

            {/* Location */}
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{location}</span>
            </div>

            {/* Secondary information based on what's available */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-1">
              {industry && (
                <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  {industry}
                </div>
              )}
              {abn && (
                <div className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
                  ABN: {abn}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description with highlighting */}
        {searchQuery ? (
          <HighlightedDescription description={description} query={searchQuery} />
        ) : (
          <p className="text-sm text-gray-700 my-6">
            {description}
          </p>
        )}

        {/* Company Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {teamSize && (
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-gray-500 text-sm mb-1">Team size</div>
              <div className="text-primary text-xl font-bold">{teamSize}</div>
            </div>
          )}

          {hourlyRate && (
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-gray-500 text-sm mb-1">Hourly Rate</div>
              {renderDollarSigns(hourlyRate)}
            </div>
          )}
        </div>

        {/* Services */}
        <div className="mb-6">
          <h4 className="text-gray-700 font-semibold mb-2">Services:</h4>
          <div className="flex flex-wrap gap-2">
            {services.slice(0, 3).map((service, index) => (
              <span key={index} className="bg-blue-50 text-gray-700 px-4 py-2 rounded text-sm">
                {service}
              </span>
            ))}
            {services.length > 3 && (
              <span className="bg-blue-50 text-gray-700 px-4 py-2 rounded text-sm">
                + See more
              </span>
            )}
          </div>
        </div>

        <hr className="my-4" />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/company/${id}`} className="flex-1">
            <Button variant="outline" className="w-full border-2 border-gray-800 text-gray-800 hover:bg-gray-100">
              View profile
            </Button>
          </Link>

          <Button
            onClick={toggleComparison}
            disabled={maxReached && !inComparison}
            className={`w-32 ${
              inComparison
                ? 'bg-gray-200 text-primary border-2 border-primary hover:bg-gray-300'
                : maxReached
                  ? 'bg-gray-100 text-gray-400 border-2 border-gray-300 cursor-not-allowed'
                  : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
            }`}
          >
            {inComparison ? 'Remove' : 'Compare'}
          </Button>

          <Link href="#" className="flex-1">
            <Button className="w-full bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white">
              Get a Quote
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
