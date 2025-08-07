"use client";

import { useState } from "react";
import { Company } from "../types";
import { getCleanABN } from "../utils/abnUtils";

export function useCompanyActions() {
  const [abnLookupLoading, setAbnLookupLoading] = useState(false);

  // ABN Lookup functionality
  const handleAbnLookup = async (abn: string) => {
    const cleanABN = getCleanABN(abn);
    if (cleanABN.length !== 11) {
      alert("Please enter a valid 11-digit ABN");
      return null;
    }

    setAbnLookupLoading(true);
    try {
      const response = await fetch("/api/admin/companies/abn-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ abn: cleanABN }),
      });

      if (!response.ok) {
        throw new Error("ABN lookup failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("ABN lookup error:", error);
      alert("Failed to lookup ABN. Please check the ABN and try again.");
      return null;
    } finally {
      setAbnLookupLoading(false);
    }
  };

  // Industry selection handler
  const handleIndustrySelection = async (
    level1: string,
    level2: string,
    level3: string,
    setFormData: (data: any) => void
  ) => {
    setFormData((prev: Company) => ({
      ...prev,
      industry_1: level1,
      industry_2: level2,
      industry_3: level3,
      industry: level3 || level2 || level1,
    }));
  };

  // Generate services for industry
  const generateServicesForIndustry = async (
    selectedIndustry: string,
    setFormData: (data: any) => void
  ) => {
    try {
      const response = await fetch(
        "/api/admin/companies/services-by-industry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ industry: selectedIndustry }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate services");
      }

      const services = await response.json();
      setFormData((prev: Company) => ({
        ...prev,
        services: services.map((service: any) => ({
          id: undefined,
          title: service.title,
          description: service.description,
        })),
      }));
    } catch (error) {
      console.error("Error generating services:", error);
      alert("Failed to generate services. Please try again.");
    }
  };

  // Office management
  const addOffice = (setFormData: (data: any) => void) => {
    setFormData((prev: Company) => ({
      ...prev,
      offices: [
        ...(prev.offices || []),
        {
          id: undefined,
          address: "",
          city: "",
          state: "",
          postalCode: "",
          phone: "",
          email: "",
          contactPerson: "",
          isHeadquarter: false,
        },
      ],
    }));
  };

  const updateOffice = (
    index: number,
    field: string,
    value: any,
    setFormData: (data: any) => void
  ) => {
    setFormData((prev: Company) => ({
      ...prev,
      offices: prev.offices?.map((office, i) =>
        i === index ? { ...office, [field]: value } : office
      ),
    }));
  };

  const removeOffice = (index: number, setFormData: (data: any) => void) => {
    setFormData((prev: Company) => ({
      ...prev,
      offices: prev.offices?.filter((_, i) => i !== index),
    }));
  };

  // Service management
  const addService = (setFormData: (data: any) => void) => {
    setFormData((prev: Company) => ({
      ...prev,
      services: [
        ...(prev.services || []),
        {
          id: undefined,
          title: "",
          description: "",
        },
      ],
    }));
  };

  const updateService = (
    index: number,
    field: string,
    value: string,
    setFormData: (data: any) => void
  ) => {
    setFormData((prev: Company) => ({
      ...prev,
      services: prev.services?.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  const removeService = (index: number, setFormData: (data: any) => void) => {
    setFormData((prev: Company) => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index),
    }));
  };

  // History management
  const addHistory = (setFormData: (data: any) => void) => {
    setFormData((prev: Company) => ({
      ...prev,
      history: [
        ...(prev.history || []),
        {
          id: undefined,
          year: new Date().getFullYear().toString(),
          event: "",
        },
      ],
    }));
  };

  const updateHistory = (
    index: number,
    field: string,
    value: string,
    setFormData: (data: any) => void
  ) => {
    setFormData((prev: Company) => ({
      ...prev,
      history: prev.history?.map((event, i) =>
        i === index ? { ...event, [field]: value } : event
      ),
    }));
  };

  const removeHistory = (index: number, setFormData: (data: any) => void) => {
    setFormData((prev: Company) => ({
      ...prev,
      history: prev.history?.filter((_, i) => i !== index),
    }));
  };

  return {
    abnLookupLoading,
    handleAbnLookup,
    handleIndustrySelection,
    generateServicesForIndustry,
    addOffice,
    updateOffice,
    removeOffice,
    addService,
    updateService,
    removeService,
    addHistory,
    updateHistory,
    removeHistory,
  };
}
