"use client";

import { useState, useEffect } from "react";
import { Company } from "../types";
import { formatABN } from "../utils/abnUtils";
import { generateUniqueSlug } from "../utils/slugUtils";

export function useCompanyEditForm(
  company: Company | null,
  isCreating: boolean
) {
  const [formData, setFormData] = useState<Company>({
    name: "",
    trading_name: "",
    slug: "",
    abn: "",
    industry: "",
    industry_1: "",
    industry_2: "",
    industry_3: "",
    status: "active",
    foundedYear: new Date().getFullYear(),
    website: "",
    email: "",
    phone: "",
    logo: "",
    employeeCount: "",
    shortDescription: "",
    fullDescription: "",
    languages: [],
    offices: [],
    services: [],
    history: [],
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "basic" | "offices" | "services" | "history"
  >("basic");

  // Initialize form data when company changes
  useEffect(() => {
    if (company && !isCreating) {
      setFormData({
        ...company,
        abn: formatABN(company.abn || ""),
      });
    } else if (isCreating) {
      resetFormToEmpty();
    }
  }, [company, isCreating]);

  const resetFormToEmpty = () => {
    setFormData({
      name: "",
      trading_name: "",
      slug: "",
      abn: "",
      industry: "",
      industry_1: "",
      industry_2: "",
      industry_3: "",
      status: "active",
      foundedYear: new Date().getFullYear(),
      website: "",
      email: "",
      phone: "",
      logo: "",
      employeeCount: "",
      shortDescription: "",
      fullDescription: "",
      languages: [],
      offices: [],
      services: [],
      history: [],
    });
    setActiveTab("basic");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleABNChange = (value: string) => {
    const formattedABN = formatABN(value);
    handleInputChange("abn", formattedABN);
  };

  const handleNameChange = async (name: string) => {
    handleInputChange("name", name);

    // Auto-generate slug for new companies
    if (isCreating && name.trim()) {
      const slug = await generateUniqueSlug(name);
      handleInputChange("slug", slug);
    }
  };

  return {
    formData,
    setFormData,
    saving,
    setSaving,
    saveSuccess,
    setSaveSuccess,
    activeTab,
    setActiveTab,
    resetFormToEmpty,
    handleInputChange,
    handleABNChange,
    handleNameChange,
  };
}
