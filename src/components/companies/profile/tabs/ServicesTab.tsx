"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Service } from "@/types/service";

interface ServicesTabProps {
  services: Service[];
  loading: boolean;
  error: string | null;
}

export function ServicesTab({ services, loading, error }: ServicesTabProps) {
  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Services</h2>
        <div className="text-center py-4">Loading services information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Services</h2>
        <div className="text-center py-4 text-red-500">
          Error loading services: {error}
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Services</h2>
        <div className="text-center py-4">
          No services information available for this company.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.serviceId} className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-primary">
              {service.title}
            </h3>
            <p className="text-gray-600">{service.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
