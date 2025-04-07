"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/components/comparison/ComparisonContext';
import { ArrowLeft, X, Star, Users, DollarSign, Clock, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ComparisonFilter, ComparisonFilterCategory } from '@/components/comparison/ComparisonFilter';
import {
  comparisonFeatures,
  getFilteredFeatures,
  getFilteredServices,
  shouldHighlightValue
} from '@/components/comparison/comparisonUtils';

export default function ComparisonPage() {
  const { selectedCompanies, removeFromComparison, clearComparison, hideCompareButton } = useComparison();
  const router = useRouter();

  // State for filters
  const [activeFilter, setActiveFilter] = useState<ComparisonFilterCategory>('all');
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  // Get filtered features and services based on active filter
  const filteredFeatures = getFilteredFeatures(activeFilter, selectedCompanies);
  const filteredServices = getFilteredServices(activeFilter, selectedCompanies);

  // Hide the compare button on the comparison page
  useEffect(() => {
    hideCompareButton();
  }, [hideCompareButton]);

  // If no companies are selected, redirect to companies page
  useEffect(() => {
    if (selectedCompanies.length === 0) {
      router.push('/companies');
    }
  }, [selectedCompanies, router]);

  if (selectedCompanies.length === 0) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">No Companies Selected</h1>
        <p className="mb-8">Select companies to compare from the companies list.</p>
        <Link href="/companies">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </Link>
      </div>
    );
  }

  // Toggle highlight differences
  const handleToggleHighlight = () => {
    setHighlightDifferences(!highlightDifferences);
  };

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/companies" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Link>

        <h1 className="text-2xl font-bold">Company Comparison</h1>

        <Button
          variant="outline"
          size="sm"
          onClick={clearComparison}
        >
          Clear All
        </Button>
      </div>

      {/* Comparison Filters */}
      <ComparisonFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        highlightDifferences={highlightDifferences}
        onToggleHighlight={handleToggleHighlight}
      />

      {/* Comparison table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          {/* Header row with company info */}
          <thead>
            <tr>
              <th className="w-48 p-3 text-left text-gray-600 bg-gray-50 border-b border-r">
                Features
              </th>

              {selectedCompanies.map(company => (
                <th key={company.id} className="p-3 text-center border-b">
                  <div className="flex flex-col items-center relative">
                    <button
                      onClick={() => removeFromComparison(company.id)}
                      className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                      title="Remove from comparison"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <h3 className="font-bold text-lg mb-1">
                      {company.name}
                    </h3>

                    <Link
                      href={`/company/${company.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </th>
              ))}

              {/* Add placeholder columns if less than 4 companies */}
              {Array.from({ length: Math.max(0, 4 - selectedCompanies.length) }).map((_, index) => (
                <th key={`empty-${index}`} className="p-3 border-b">
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-md p-6">
                    <p className="text-gray-400 text-center mb-2">Add another company</p>
                    <Link href="/companies">
                      <Button variant="outline" size="sm">
                        Select Company
                      </Button>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Basic Information Section */}
            {(activeFilter === 'all' || activeFilter === 'basic' ||
              activeFilter === 'differences' || activeFilter === 'similarities') &&
              filteredFeatures.filter(f => f.category === 'basic').length > 0 && (
              <>
                <tr className="bg-gray-50">
                  <td colSpan={selectedCompanies.length + 1 + (4 - selectedCompanies.length)} className="p-3 font-semibold border-b">
                    Basic Information
                  </td>
                </tr>

                {/* Basic Info Features */}
                {filteredFeatures
                  .filter(feature => feature.category === 'basic')
                  .map(feature => (
                    <tr key={feature.id}>
                      <td className="p-3 border-b border-r bg-gray-50">
                        <div className="flex items-center">
                          {feature.id === 'location' && <MapPin className="h-4 w-4 mr-2 text-gray-500" />}
                          {feature.id === 'industry' && <Star className="h-4 w-4 mr-2 text-gray-500" />}
                          {feature.id === 'teamSize' && <Users className="h-4 w-4 mr-2 text-gray-500" />}
                          {feature.id === 'founded' && <Calendar className="h-4 w-4 mr-2 text-gray-500" />}
                          {feature.label}
                        </div>
                      </td>

                      {selectedCompanies.map(company => {
                        const value = feature.getValue(company);
                        const highlight = shouldHighlightValue(feature, value, selectedCompanies, highlightDifferences);

                        return (
                          <td
                            key={`${company.id}-${feature.id}`}
                            className={`p-3 text-center border-b ${highlight ? 'bg-yellow-50' : ''}`}
                          >
                            {value !== undefined ? String(value) : "Not specified"}
                          </td>
                        );
                      })}

                      {/* Empty cells for placeholder */}
                      {Array.from({ length: Math.max(0, 4 - selectedCompanies.length) }).map((_, index) => (
                        <td key={`empty-${feature.id}-${index}`} className="p-3 border-b"></td>
                      ))}
                    </tr>
                  ))
                }
              </>
            )}

            {/* Financial Information Section */}
            {(activeFilter === 'all' || activeFilter === 'financial' ||
              activeFilter === 'differences' || activeFilter === 'similarities') &&
              filteredFeatures.filter(f => f.category === 'financial').length > 0 && (
              <>
                <tr className="bg-gray-50">
                  <td colSpan={selectedCompanies.length + 1 + (4 - selectedCompanies.length)} className="p-3 font-semibold border-b">
                    Financial Information
                  </td>
                </tr>

                {/* Financial Features */}
                {filteredFeatures
                  .filter(feature => feature.category === 'financial')
                  .map(feature => (
                    <tr key={feature.id}>
                      <td className="p-3 border-b border-r bg-gray-50">
                        <div className="flex items-center">
                          {feature.id === 'hourlyRate' && <DollarSign className="h-4 w-4 mr-2 text-gray-500" />}
                          {feature.id === 'minimumProjectSize' && <DollarSign className="h-4 w-4 mr-2 text-gray-500" />}
                          {feature.id === 'avgProjectLength' && <Clock className="h-4 w-4 mr-2 text-gray-500" />}
                          {feature.label}
                        </div>
                      </td>

                      {selectedCompanies.map(company => {
                        const value = feature.getValue(company);
                        const highlight = shouldHighlightValue(feature, value, selectedCompanies, highlightDifferences);

                        return (
                          <td
                            key={`${company.id}-${feature.id}`}
                            className={`p-3 text-center border-b ${highlight ? 'bg-yellow-50' : ''}`}
                          >
                            {value !== undefined ? String(value) : "Not specified"}
                          </td>
                        );
                      })}

                      {/* Empty cells for placeholder */}
                      {Array.from({ length: Math.max(0, 4 - selectedCompanies.length) }).map((_, index) => (
                        <td key={`empty-${feature.id}-${index}`} className="p-3 border-b"></td>
                      ))}
                    </tr>
                  ))
                }
              </>
            )}

            {/* Services Section */}
            {(activeFilter === 'all' || activeFilter === 'services' ||
              activeFilter === 'differences' || activeFilter === 'similarities') &&
              filteredServices.length > 0 && (
              <>
                <tr className="bg-gray-50">
                  <td colSpan={selectedCompanies.length + 1 + (4 - selectedCompanies.length)} className="p-3 font-semibold border-b">
                    Services
                  </td>
                </tr>

                {/* List all filtered services */}
                {filteredServices.map(service => {
                  const companiesWithService = selectedCompanies.filter(c =>
                    c.services.includes(service)
                  );
                  const allHaveService = companiesWithService.length === selectedCompanies.length;
                  const noneHaveService = companiesWithService.length === 0;
                  const highlight = highlightDifferences && !allHaveService && !noneHaveService;

                  return (
                    <tr key={service}>
                      <td className="p-3 border-b border-r bg-gray-50">
                        {service}
                      </td>

                      {selectedCompanies.map(company => {
                        const hasService = company.services.includes(service);

                        return (
                          <td
                            key={`${company.id}-service-${service}`}
                            className={`p-3 text-center border-b ${highlight ? 'bg-yellow-50' : ''}`}
                          >
                            {hasService ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span className="text-red-500">✗</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Empty cells for placeholder */}
                      {Array.from({ length: Math.max(0, 4 - selectedCompanies.length) }).map((_, index) => (
                        <td key={`empty-service-${service}-${index}`} className="p-3 border-b"></td>
                      ))}
                    </tr>
                  );
                })}
              </>
            )}

            {/* Technical Features Section */}
            {(activeFilter === 'all' || activeFilter === 'technical' ||
              activeFilter === 'differences' || activeFilter === 'similarities') &&
              filteredFeatures.filter(f => f.category === 'technical').length > 0 && (
              <>
                <tr className="bg-gray-50">
                  <td colSpan={selectedCompanies.length + 1 + (4 - selectedCompanies.length)} className="p-3 font-semibold border-b">
                    Technical Capabilities
                  </td>
                </tr>

                {/* Technical Features */}
                {filteredFeatures
                  .filter(feature => feature.category === 'technical')
                  .map(feature => (
                    <tr key={feature.id}>
                      <td className="p-3 border-b border-r bg-gray-50">
                        <div className="flex items-center">
                          {feature.label}
                        </div>
                      </td>

                      {selectedCompanies.map(company => {
                        const value = feature.getValue(company);
                        const highlight = shouldHighlightValue(feature, value, selectedCompanies, highlightDifferences);

                        return (
                          <td
                            key={`${company.id}-${feature.id}`}
                            className={`p-3 text-center border-b ${highlight ? 'bg-yellow-50' : ''}`}
                          >
                            {value !== undefined ? String(value) : "Not specified"}
                          </td>
                        );
                      })}

                      {/* Empty cells for placeholder */}
                      {Array.from({ length: Math.max(0, 4 - selectedCompanies.length) }).map((_, index) => (
                        <td key={`empty-${feature.id}-${index}`} className="p-3 border-b"></td>
                      ))}
                    </tr>
                  ))
                }
              </>
            )}

            {/* No Results Message */}
            {filteredFeatures.length === 0 && filteredServices.length === 0 && (
              <tr>
                <td colSpan={selectedCompanies.length + 1 + (4 - selectedCompanies.length)} className="p-8 text-center text-gray-500">
                  <p className="mb-2 font-medium">No features match the current filter</p>
                  <p>Try selecting a different filter option to see more comparison data.</p>
                </td>
              </tr>
            )}

            {/* Actions Row */}
            <tr>
              <td className="p-3 border-r bg-gray-50">
                Actions
              </td>

              {selectedCompanies.map(company => (
                <td key={`${company.id}-actions`} className="p-3 text-center">
                  <div className="flex flex-col space-y-2">
                    <Link href={`/company/${company.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    <Button size="sm" className="w-full">
                      Get a Quote
                    </Button>
                  </div>
                </td>
              ))}

              {/* Empty cells for placeholder */}
              {Array.from({ length: Math.max(0, 4 - selectedCompanies.length) }).map((_, index) => (
                <td key={`empty-actions-${index}`} className="p-3"></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
