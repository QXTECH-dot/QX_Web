"use client";

import React from "react";
import { Company, OfficeType } from "../types";
import { CompanyAbout } from "../sections/CompanyAbout";
import { CompanyOffices } from "../sections/CompanyOffices";
import { CompanyContactInfo } from "../sections/CompanyContactInfo";

interface OverviewTabProps {
  company: Company;
  offices: OfficeType[];
  officesLoading: boolean;
  selectedOffice: OfficeType | null;
  onOfficeSelect: (office: OfficeType) => void;
}

export function OverviewTab({
  company,
  offices,
  officesLoading,
  selectedOffice,
  onOfficeSelect,
}: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 space-y-6 lg:space-y-8">
        <CompanyAbout company={company} />
        <CompanyOffices
          offices={offices}
          loading={officesLoading}
          selectedOffice={selectedOffice}
          onOfficeSelect={onOfficeSelect}
        />
      </div>

      <div className="order-first lg:order-last">
        <CompanyContactInfo company={company} selectedOffice={selectedOffice} />
      </div>
    </div>
  );
}
