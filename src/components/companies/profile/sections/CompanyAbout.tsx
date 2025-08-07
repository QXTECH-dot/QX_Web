"use client";

import React from "react";
import { Company } from "../types";

interface CompanyAboutProps {
  company: Company;
}

export function CompanyAbout({ company }: CompanyAboutProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">About {company.name}</h2>
      <p className="text-muted-foreground mb-6 whitespace-pre-line">
        {company.longDescription || company.fullDescription}
      </p>
    </div>
  );
}
