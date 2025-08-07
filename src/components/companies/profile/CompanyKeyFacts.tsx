"use client";

import React from "react";
import { Globe, Users, Calendar } from "lucide-react";
import { Company } from "./types";
import { formatLanguages } from "./constants";

interface CompanyKeyFactsProps {
  company: Company;
}

export function CompanyKeyFacts({ company }: CompanyKeyFactsProps) {
  return (
    <div className="bg-white rounded-lg p-4 mb-6 sm:mb-8 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {company.languages && (
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-primary mr-3" />
            <div>
              <p className="text-xs text-muted-foreground">Languages</p>
              <p className="font-medium">
                {formatLanguages(company.languages)}
              </p>
            </div>
          </div>
        )}
        {company.teamSize && (
          <div className="flex items-center">
            <Users className="h-5 w-5 text-primary mr-3" />
            <div>
              <p className="text-xs text-muted-foreground">Team Size</p>
              <p className="font-medium">{company.teamSize}</p>
            </div>
          </div>
        )}
        {(company.founded || company.foundedYear) && (
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary mr-3" />
            <div>
              <p className="text-xs text-muted-foreground">Founded</p>
              <p className="font-medium">
                {company.founded || company.foundedYear}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
