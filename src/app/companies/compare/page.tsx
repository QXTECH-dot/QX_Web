"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/components/comparison/ComparisonContext';
import { ArrowLeft, X, Star, Users, DollarSign, Clock, Calendar, MapPin, Building } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ComparisonFilter, ComparisonFilterCategory } from '@/components/comparison/ComparisonFilter';
import {
  comparisonFeatures,
  getFilteredFeatures,
  getFilteredServices,
  shouldHighlightValue
} from '@/components/comparison/comparisonUtils';

function ComparisonPageContent({
  selectedCompanies,
  removeFromComparison,
  clearComparison,
  hideCompareButton,
  loadCompaniesFromUrl,
  router
}: any) {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  // State for filters
  const [activeFilter, setActiveFilter] = useState<ComparisonFilterCategory>('all');
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const hasLogoError = (companyId: string) => logoErrors[companyId] === true;
  const setLogoError = (companyId: string) => {
    setLogoErrors(prev => ({ ...prev, [companyId]: true }));
  };
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const companyIds = searchParams.get('companies')?.split(',').filter(Boolean);
      if (companyIds && companyIds.length > 0) {
        loadCompaniesFromUrl(companyIds);
      }
      setIsLoading(false);
    };
    loadData();
  }, [searchParams, loadCompaniesFromUrl]);
  useEffect(() => { hideCompareButton(); }, [hideCompareButton]);
  useEffect(() => { if (!isLoading && selectedCompanies.length === 0) { router.push('/companies'); } }, [selectedCompanies.length, router, isLoading]);
  const handleToggleHighlight = () => { setHighlightDifferences(!highlightDifferences); };
  const filteredFeatures = getFilteredFeatures(activeFilter, selectedCompanies);
  const filteredServices = getFilteredServices(activeFilter, selectedCompanies);
  if (isLoading) {
    return (<div className="container py-10 text-center"><p>Loading comparison data...</p></div>);
  }
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
          disabled={selectedCompanies.length === 0}
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
                Companies
              </th>

              {selectedCompanies.map((company: any) => (
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
                      {company.logo && !hasLogoError(company.id) ? (
                        <Image
                          src={company.logo}
                          alt={`${company.name || company.name_en || 'Company'} logo`}
                          fill
                          className="object-contain"
                          onError={() => setLogoError(company.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Building className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-lg mb-1">
                      {company.name || company.name_en || 'Unnamed Company'}
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
            <tr className="bg-gray-50">
              <td colSpan={5} className="p-3 font-semibold border-b">
                Basic Information
              </td>
            </tr>
            {comparisonFeatures
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
                  {Array.from({ length: 4 }).map((_, index) => (
                    <td key={`empty-${feature.id}-${index}`} className="p-3 text-center border-b">
                      {selectedCompanies[index] ? (
                        String(feature.getValue(selectedCompanies[index]) ?? "Not specified")
                      ) : (
                        "—"
                      )}
                    </td>
                  ))}
                </tr>
              ))}

            {/* Services Section */}
            <tr className="bg-gray-50">
              <td colSpan={5} className="p-3 font-semibold border-b">
                Services
              </td>
            </tr>
            {filteredServices.map(service => (
              <tr key={service}>
                <td className="p-3 border-b border-r bg-gray-50">
                  {service}
                </td>
                {Array.from({ length: 4 }).map((_, index) => (
                  <td key={`empty-service-${service}-${index}`} className="p-3 text-center border-b">
                    {selectedCompanies[index] ? (
                      selectedCompanies[index].services.includes(service) ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )
                    ) : (
                      "—"
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Technical Features Section */}
            <tr className="bg-gray-50">
              <td colSpan={5} className="p-3 font-semibold border-b">
                Technical Capabilities
              </td>
            </tr>
            {comparisonFeatures
              .filter(feature => feature.category === 'technical')
              .map(feature => (
                <tr key={feature.id}>
                  <td className="p-3 border-b border-r bg-gray-50">
                    <div className="flex items-center">
                      {feature.label}
                    </div>
                  </td>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <td key={`empty-${feature.id}-${index}`} className="p-3 text-center border-b">
                      {selectedCompanies[index] ? (
                        String(feature.getValue(selectedCompanies[index]) ?? "Not specified")
                      ) : (
                        "—"
                      )}
                    </td>
                  ))}
                </tr>
              ))}

            {/* Actions Row */}
            <tr>
              <td className="p-3 border-r bg-gray-50">
                Actions
              </td>
              {Array.from({ length: 4 }).map((_, index) => (
                <td key={`empty-actions-${index}`} className="p-3 text-center">
                  {selectedCompanies[index] ? (
                    <div className="flex flex-col space-y-2">
                      <Link href={`/company/${selectedCompanies[index].id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      <Button size="sm" className="w-full">
                        Get a Quote
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-400">—</div>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  const comparison = useComparison();
  const router = useRouter();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComparisonPageContent {...comparison} router={router} />
    </Suspense>
  );
}
