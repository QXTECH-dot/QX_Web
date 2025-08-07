"use client";

import React from "react";
import Link from "next/link";
import { Building, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Company } from "./types";

interface SimilarCompaniesProps {
  companies: Company[];
  loading: boolean;
}

export function SimilarCompanies({
  companies,
  loading,
}: SimilarCompaniesProps) {
  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4 sm:mb-6">Similar Companies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="overflow-hidden flex flex-col h-full animate-pulse"
            >
              <div className="p-4 sm:p-6 border-b">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-md mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
              <div className="p-4 mt-auto">
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4 sm:mb-6">Similar Companies</h2>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">
            No similar companies found in the same industry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 sm:mb-6">Similar Companies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <Card
            key={company.id}
            className="overflow-hidden flex flex-col h-full"
          >
            <div className="p-4 sm:p-6 border-b">
              <div className="flex items-center mb-4">
                <div className="relative w-20 h-14 rounded-md overflow-hidden bg-white shadow-sm mr-3 flex items-center justify-center flex-shrink-0">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={`${company.name_en || company.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm leading-tight flex items-center">
                    <span className="truncate">
                      {company.name_en || company.name}
                    </span>
                    {company.verified && (
                      <span className="ml-1 text-xs text-primary flex-shrink-0">
                        <Check className="h-3 w-3 inline-block" />
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {company.location || "Location not specified"}
                  </p>
                  <p className="text-xs text-blue-600 truncate mt-1">
                    {company.third_industry ||
                      company.second_industry ||
                      company.industry}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {company.shortDescription ||
                  company.description ||
                  "No description available"}
              </p>
            </div>
            <div className="p-4 mt-auto">
              <Link href={`/company/${company.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
