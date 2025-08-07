"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { OfficeType } from "../types";

interface CompanyOfficesProps {
  offices: OfficeType[];
  loading: boolean;
  selectedOffice: OfficeType | null;
  onOfficeSelect: (office: OfficeType) => void;
}

export function CompanyOffices({
  offices,
  loading,
  selectedOffice,
  onOfficeSelect,
}: CompanyOfficesProps) {
  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Office Locations</h2>
        <p className="text-muted-foreground">Loading office information...</p>
      </div>
    );
  }

  if (offices.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Office Locations</h2>
        <p className="text-muted-foreground">
          No office information available for this company.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Office Locations</h2>
      <div className="space-y-4">
        {offices.map((office: OfficeType) => (
          <div
            key={office.officeId}
            className={`flex items-start p-3 rounded-md cursor-pointer transition-colors ${
              selectedOffice?.officeId === office.officeId
                ? "bg-primary/10"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onOfficeSelect(office)}
          >
            <MapPin
              className={`h-5 w-5 mt-1 mr-3 flex-shrink-0 ${
                selectedOffice?.officeId === office.officeId
                  ? "text-primary"
                  : "text-gray-400"
              }`}
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {office.city} Office
                {office.isHeadquarters && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Headquarters
                  </span>
                )}
              </h3>
              <p className="text-gray-600">{office.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
