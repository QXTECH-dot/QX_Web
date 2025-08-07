"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company } from '@/types/company';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { companiesData } from '@/data/companiesData';

type ComparisonContextType = {
  selectedCompanies: Company[];
  addToComparison: (company: Company) => void;
  removeFromComparison: (companyId: string) => void;
  clearComparison: () => void;
  isInComparison: (companyId: string) => boolean;
  comparisonCount: number;
  showCompareButton: boolean;
  hideCompareButton: () => void;
  showCompareButton: () => void;
  generateSharingUrl: () => string;
  loadCompaniesFromUrl: (ids: string[]) => void;
};

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [showCompareButton, setShowCompareButton] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load companies from URL parameters on mount
  useEffect(() => {
    if (pathname === '/companies/compare') {
      const companyIds = searchParams.get('companies')?.split(',') || [];

      if (companyIds.length > 0) {
        loadCompaniesFromUrl(companyIds);
      } else {
        try {
          // If no URL params, try to load from localStorage
          const savedCompanies = localStorage.getItem('comparisonCompanies');
          if (savedCompanies) {
            setSelectedCompanies(JSON.parse(savedCompanies));
          }
        } catch (error) {
          console.error('Error restoring comparison data:', error);
        }
      }
    } else {
      // For other pages, load from localStorage
      try {
        const savedCompanies = localStorage.getItem('comparisonCompanies');
        if (savedCompanies) {
          setSelectedCompanies(JSON.parse(savedCompanies));
        }
      } catch (error) {
        console.error('Error restoring comparison data:', error);
      }
    }
  }, [pathname, searchParams]);

  // Save selected companies to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('comparisonCompanies', JSON.stringify(selectedCompanies));
      setComparisonCount(selectedCompanies.length);

      // Show the compare button if there are at least 2 companies selected
      if (selectedCompanies.length >= 2) {
        setShowCompareButton(true);
      } else {
        setShowCompareButton(false);
      }

      // Update URL if on compare page
      if (pathname === '/companies/compare' && selectedCompanies.length > 0) {
        const ids = selectedCompanies.map(c => c.id).join(',');
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('companies', ids);
        window.history.replaceState({}, '', currentUrl.toString());
      }
    } catch (error) {
      console.error('Error saving comparison data:', error);
    }
  }, [selectedCompanies, pathname]);

  // Hide compare button on comparison page
  useEffect(() => {
    if (pathname === '/companies/compare') {
      setShowCompareButton(false);
    } else if (selectedCompanies.length >= 2) {
      setShowCompareButton(true);
    }
  }, [pathname, selectedCompanies.length]);

  const addToComparison = (company: Company) => {
    // Maximum of 4 companies for comparison
    if (selectedCompanies.length >= 4) return;

    // Check if company is already in comparison
    if (selectedCompanies.some(c => c.id === company.id)) return;

    setSelectedCompanies([...selectedCompanies, company]);
  };

  const removeFromComparison = (companyId: string) => {
    setSelectedCompanies(selectedCompanies.filter(c => c.id !== companyId));
  };

  const clearComparison = () => {
    setSelectedCompanies([]);
  };

  const isInComparison = (companyId: string) => {
    return selectedCompanies.some(c => c.id === companyId);
  };

  const hideCompareButton = () => {
    setShowCompareButton(false);
  };

  const showCompareButtonFn = () => {
    if (selectedCompanies.length >= 2) {
      setShowCompareButton(true);
    }
  };

  // Generate sharing URL with company IDs
  const generateSharingUrl = () => {
    if (selectedCompanies.length === 0) return '';

    const baseUrl = typeof window !== 'undefined' ?
      `${window.location.protocol}//${window.location.host}` :
      'https://qxweb.com';

    const ids = selectedCompanies.map(c => c.id).join(',');
    return `${baseUrl}/companies/compare?companies=${ids}`;
  };

  // Load companies from URL IDs
  const loadCompaniesFromUrl = (ids: string[]) => {
    // Limit to 4 companies
    const limitedIds = ids.slice(0, 4);

    // Find companies in data
    const companies = limitedIds
      .map(id => companiesData.find(c => c.id === id))
      .filter((c): c is Company => c !== undefined);

    setSelectedCompanies(companies);
  };

  const value = {
    selectedCompanies,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount,
    showCompareButton,
    hideCompareButton,
    showCompareButton: showCompareButtonFn,
    generateSharingUrl,
    loadCompaniesFromUrl
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
