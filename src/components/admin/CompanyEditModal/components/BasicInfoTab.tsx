"use client";

import React from "react";
import { Building2, Phone, Mail, Globe, Calendar, Users } from "lucide-react";
import { Company } from "../types";
import { employeeCountOptions, statusOptions } from "../constants";
import LanguageSelector from "../../LanguageSelector";
import IndustrySelector from "../../IndustrySelector";

interface BasicInfoTabProps {
  formData: Company;
  onInputChange: (field: string, value: any) => void;
  onABNChange: (value: string) => void;
  onNameChange: (name: string) => void;
  onIndustrySelection: (level1: string, level2: string, level3: string) => void;
  abnLookupLoading: boolean;
  onAbnLookup: (abn: string) => Promise<any>;
}

export function BasicInfoTab({
  formData,
  onInputChange,
  onABNChange,
  onNameChange,
  onIndustrySelection,
  abnLookupLoading,
  onAbnLookup,
}: BasicInfoTabProps) {
  const handleAbnLookupClick = async () => {
    if (formData.abn) {
      const result = await onAbnLookup(formData.abn);
      if (result) {
        onNameChange(result.name || "");
        onInputChange("trading_name", result.tradingName || "");
        onInputChange("website", result.website || "");
        onInputChange("email", result.email || "");
        onInputChange("phone", result.phone || "");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Building2 size={16} className="inline mr-1" />
            Company Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Enter company name"
            required
          />
        </div>

        {/* Trading Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trading Name
          </label>
          <input
            type="text"
            value={formData.trading_name || ""}
            onChange={(e) => onInputChange("trading_name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Trading name (if different)"
          />
        </div>

        {/* ABN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ABN *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.abn}
              onChange={(e) => onABNChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="00 000 000 000"
              required
            />
            <button
              type="button"
              onClick={handleAbnLookupClick}
              disabled={abnLookupLoading || !formData.abn}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {abnLookupLoading ? "Loading..." : "Lookup"}
            </button>
          </div>
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug
          </label>
          <input
            type="text"
            value={formData.slug || ""}
            onChange={(e) => onInputChange("slug", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="company-url-slug"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <IndustrySelector
            selectedIndustry1={formData.industry_1 || ""}
            selectedIndustry2={formData.industry_2 || ""}
            selectedIndustry3={formData.industry_3 || ""}
            onSelectionChange={onIndustrySelection}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => onInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Founded Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar size={16} className="inline mr-1" />
            Founded Year
          </label>
          <input
            type="number"
            value={formData.foundedYear}
            onChange={(e) =>
              onInputChange("foundedYear", parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>

        {/* Employee Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Users size={16} className="inline mr-1" />
            Employee Count
          </label>
          <select
            value={formData.employeeCount}
            onChange={(e) => onInputChange("employeeCount", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Select employee count</option>
            {employeeCountOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Globe size={16} className="inline mr-1" />
            Website
          </label>
          <input
            type="url"
            value={formData.website || ""}
            onChange={(e) => onInputChange("website", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="https://example.com"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail size={16} className="inline mr-1" />
            Email
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="contact@company.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone size={16} className="inline mr-1" />
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => onInputChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="+61 2 1234 5678"
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Languages Supported
          </label>
          <LanguageSelector
            selectedLanguages={formData.languages || []}
            onChange={(languages: string[]) =>
              onInputChange("languages", languages)
            }
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <textarea
            value={formData.shortDescription || ""}
            onChange={(e) => onInputChange("shortDescription", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Brief description of the company..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Description
          </label>
          <textarea
            value={formData.fullDescription || ""}
            onChange={(e) => onInputChange("fullDescription", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Detailed description of the company..."
          />
        </div>
      </div>
    </div>
  );
}
