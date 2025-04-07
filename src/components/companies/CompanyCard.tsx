"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building, MapPin, CheckCircle, Check, Globe } from "lucide-react";
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
  languages?: string[]; // Changed from hourlyRate to languages
  services?: string[];
  abn?: string;
  industries?: string[]; // Changed from industry to industries (plural array)
}

export function CompanyCard({
  id,
  name,
  logo,
  location,
  description,
  verified = false,
  teamSize,
  languages = [], // Updated from hourlyRate
  services = [],
  abn,
  industries = [] // Updated from industry
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
        languages, // Updated from hourlyRate
        services,
        abn,
        industries // Updated from industry
      };
      addToComparison(company);
    }
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
              <div className="h-[3.5rem] flex flex-col justify-start">
                <h3 className="font-bold text-lg line-clamp-2">
                  {name}
                  {verified && (
                    <CheckCircle className="inline-block h-5 w-5 text-primary ml-1" fill="white" strokeWidth={2} />
                  )}
                </h3>
              </div>
            )}

            {/* Location */}
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{location}</span>
            </div>

            {/* Industry (replacing Languages section) */}
            {industries && industries.length > 0 && (
              <div className="flex items-center text-gray-600 mb-1">
                <Building className="h-4 w-4 mr-1" />
                <span className="text-sm">{industries[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description with highlighting */}
        {searchQuery ? (
          <HighlightedDescription description={description} query={searchQuery} />
        ) : (
          <div className="h-[4.5rem] my-6">
            <p className="text-sm text-gray-700 line-clamp-3">
              {description}
            </p>
          </div>
        )}

        {/* Languages */}
        <div className="mb-4">
          <h4 className="text-gray-700 font-semibold mb-2">Languages</h4>
          <div className="h-[2.5rem]">
            <p className="text-base text-primary">
              {languages.slice(0, 3).join(', ')}
              {languages.length > 3 && ' + See more'}
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h4 className="text-gray-700 font-semibold mb-2">Services:</h4>
          <div className="h-[7.5rem] flex flex-wrap content-start gap-2">
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
        <div className="flex justify-between gap-2">
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
        </div>
      </div>
    </Card>
  );
}
