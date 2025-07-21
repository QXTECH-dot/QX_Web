"use client";

import React from "react";
import { CompanyProfile } from "./CompanyProfile";
import { Company } from '@/types/company';

interface CompanyProfileWrapperProps {
  company: Company;
  slug: string;
}

export function CompanyProfileWrapper({ 
  company, 
  slug 
}: CompanyProfileWrapperProps) {
  return (
    <div className="w-full px-4 sm:px-6 lg:max-w-[calc(100%-250px)] lg:mx-auto lg:px-0">
      <CompanyProfile id={slug} initialData={company} />
    </div>
  );
}