"use client";

import React from "react";
import Link from "next/link";
import { Check, Globe, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatABN } from "@/utils/abnFormat";
import { Company, OfficeType } from "./types";

interface CompanyHeaderProps {
  company: Company;
  offices: OfficeType[];
  onContactClick: () => void;
  onServicesClick: () => void;
}

export function CompanyHeader({
  company,
  offices,
  onContactClick,
  onServicesClick,
}: CompanyHeaderProps) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Top row: Logo and basic info */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="relative w-24 h-16 sm:w-28 sm:h-20 md:w-40 md:h-28 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center mx-auto sm:mx-0">
            <img
              src={company.logo || "/placeholder-logo.png"}
              alt={`${company.name_en || company.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mr-2">
                {company.name_en || company.name}
              </h1>
              {company.verified && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center">
                  <Check className="h-3 w-3 mr-1" /> Verified
                </span>
              )}
            </div>

            {company.abn && (
              <p className="text-muted-foreground flex items-center justify-center sm:justify-start mb-2">
                <span className="text-muted-foreground mr-2">
                  ABN: {formatABN(company.abn)}
                </span>
              </p>
            )}

            <p className="text-muted-foreground flex items-start justify-center sm:justify-start mb-2">
              <MapPin className="h-4 w-4 mr-1 mt-1 flex-shrink-0" />
              <span>
                {offices && offices.length > 0
                  ? offices.map((office: OfficeType, index: number) => (
                      <span key={office.officeId}>
                        {office.city}
                        {index < offices.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : company.location
                  ? company.location
                  : "Location not specified"}
              </span>
            </p>

            {/* 行业面包屑展示 */}
            {(company.industry ||
              company.second_industry ||
              company.third_industry) && (
              <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-blue-700 font-medium mb-2 flex-wrap">
                {company.industry && (
                  <span className="bg-blue-50 px-2 py-0.5 rounded">
                    {company.industry}
                  </span>
                )}
                {company.second_industry && (
                  <>
                    <span className="mx-1 text-gray-400">{">"}</span>
                    <span className="bg-blue-100 px-2 py-0.5 rounded">
                      {company.second_industry}
                    </span>
                  </>
                )}
                {company.third_industry && (
                  <>
                    <span className="mx-1 text-gray-400">{">"}</span>
                    <span className="bg-blue-200 px-2 py-0.5 rounded">
                      {company.third_industry}
                    </span>
                  </>
                )}
              </div>
            )}

            {company.industries && company.industries.length > 0 && (
              <p className="text-muted-foreground flex items-center justify-center sm:justify-start mb-4">
                <Building2 className="h-4 w-4 mr-1" />
                <span>{company.industries[0]}</span>
              </p>
            )}

            <div className="mb-4 sm:mb-6">
              <p className="text-gray-600 text-center sm:text-left">
                {company.shortDescription || company.description}
              </p>
            </div>

            {/* Service tags */}
            {company.services && company.services.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {company.services.slice(0, 6).map((service, index: number) => (
                  <Link
                    key={index}
                    href={`/companies?service=${encodeURIComponent(
                      typeof service === "string"
                        ? service
                        : service.title || ""
                    )}`}
                    className="bg-gray-100 hover:bg-gray-200 text-muted-foreground px-3 py-1 rounded-full text-xs transition-colors"
                  >
                    {typeof service === "string" ? service : service.title}
                  </Link>
                ))}
                {company.services.length > 6 && (
                  <button
                    onClick={onServicesClick}
                    className="bg-gray-100 hover:bg-gray-200 text-muted-foreground px-3 py-1 rounded-full text-xs transition-colors cursor-pointer"
                  >
                    +{company.services.length - 6} more
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
          <Button
            size="lg"
            className="bg-primary text-white w-full sm:w-auto hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
            onClick={onContactClick}
          >
            Get In Touch
          </Button>
          {company.website && (
            <Link
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="visit-website-button flex items-center justify-center gap-2 px-4 py-2 rounded w-full sm:w-auto"
            >
              <Globe className="h-5 w-5" />
              Visit Website
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
