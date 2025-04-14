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
import { Company, Office } from "@/types/company";

interface CompanyCardProps {
  id: string;
  name: string;
  logo: string;
  location: string;
  description: string;
  verified?: boolean;
  teamSize?: string;
  languages?: string[];
  services?: string[];
  abn?: string;
  industries?: string[];
  offices?: Office[];
}

export function CompanyCard({
  id,
  name,
  logo,
  location,
  description,
  verified = false,
  teamSize,
  languages = [],
  services = [],
  abn,
  industries = [],
  offices = []
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
        shortDescription: description,
        description: description,
        verified,
        teamSize,
        languages,
        abn,
        industry: industries || [],
        state: location,
        services: services || [],
        foundedYear: undefined,
        social: undefined
      };
      addToComparison(company);
    }
  };

  // 处理州信息
  const getDisplayedStates = () => {
    if (!offices || offices.length === 0) {
      // 如果没有办公室信息，尝试从location中提取州（如果格式允许）
      // 这是一个简化的处理，可能需要根据实际location格式调整
      const parts = location?.split(', ');
      return parts && parts.length > 1 ? [parts[parts.length - 1].split(' ')[0]] : ['N/A'];
    }

    // 提取所有州并去重
    const allStates = [...new Set(offices.map(office => office.state).filter(Boolean))];

    // 找到总部办公室
    const headquarter = offices.find(office => office.isHeadquarter);

    // 排序：总部州优先，然后按字母顺序
    allStates.sort((a, b) => {
      if (headquarter && a === headquarter.state && b !== headquarter.state) return -1;
      if (headquarter && b === headquarter.state && a !== headquarter.state) return 1;
      return a.localeCompare(b);
    });

    // 限制最多显示3个
    const displayedStates = allStates.slice(0, 3);

    // 如果州超过3个，添加省略符
    if (allStates.length > 3) {
      return [...displayedStates, "+ more"];
    }

    return displayedStates.length > 0 ? displayedStates : ['N/A'];
  };

  const displayedStates = getDisplayedStates();

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

            {/* Location - 显示处理后的州信息 */}
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{displayedStates.join(', ')}</span>
            </div>

            {/* Industry */}
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
              {Array.isArray(languages) && languages.length > 0 ? (
                <>
                  {languages.slice(0, 3).join(', ')}
                  {languages.length > 3 && ' + See more'}
                </>
              ) : (
                'No languages specified'
              )}
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
