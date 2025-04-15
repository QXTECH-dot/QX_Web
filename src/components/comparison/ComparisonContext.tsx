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
  isCompareButtonVisible: boolean;
  hideCompareButton: () => void;
  showCompareButton: () => void;
  generateSharingUrl: () => string;
  loadCompaniesFromUrl: (ids: string[]) => void;
};

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'comparisonCompanies';

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [showCompareButton, setShowCompareButton] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 从 localStorage 加载数据
  const loadFromStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // 确保数据是有效的
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          return parsedData;
        }
      }
    } catch (error) {
      console.error('Error loading comparison data:', error);
    }
    return [];
  };

  // 保存数据到 localStorage
  const saveToStorage = (companies: Company[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
    } catch (error) {
      console.error('Error saving comparison data:', error);
    }
  };

  // 初始化加载
  useEffect(() => {
    const initializeCompanies = () => {
      // 首先尝试从 URL 加载
      if (pathname === '/companies/compare') {
        const companyIds = searchParams.get('companies')?.split(',').filter(Boolean);
        if (companyIds && companyIds.length > 0) {
          const companiesFromUrl = companyIds
            .map(id => companiesData.find(c => c.id === id))
            .filter((c): c is Company => c !== undefined);
          
          if (companiesFromUrl.length > 0) {
            setSelectedCompanies(companiesFromUrl);
            saveToStorage(companiesFromUrl);
            return;
          }
        }
      }
      
      // 如果 URL 中没有数据，从 localStorage 加载
      const savedCompanies = loadFromStorage();
      if (savedCompanies.length > 0) {
        setSelectedCompanies(savedCompanies);
      }
    };

    initializeCompanies();
  }, [pathname, searchParams]);

  // 当选中的公司改变时更新状态
  useEffect(() => {
    setComparisonCount(selectedCompanies.length);
    saveToStorage(selectedCompanies);

    // 更新 URL（仅在比较页面）
    if (pathname === '/companies/compare' && selectedCompanies.length > 0) {
      const ids = selectedCompanies.map(c => c.id).join(',');
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('companies', ids);
      window.history.replaceState({}, '', currentUrl.toString());
    }
  }, [selectedCompanies, pathname]);

  const addToComparison = (company: Company) => {
    if (selectedCompanies.length >= 4) return;
    if (selectedCompanies.some(c => c.id === company.id)) return;
    
    const newCompanies = [...selectedCompanies, company];
    setSelectedCompanies(newCompanies);
    saveToStorage(newCompanies);
  };

  const removeFromComparison = (companyId: string) => {
    const newCompanies = selectedCompanies.filter(c => c.id !== companyId);
    setSelectedCompanies(newCompanies);
    saveToStorage(newCompanies);
  };

  const clearComparison = () => {
    setSelectedCompanies([]);
    localStorage.removeItem(STORAGE_KEY);
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

  const generateSharingUrl = () => {
    if (selectedCompanies.length === 0) return '';

    const baseUrl = typeof window !== 'undefined' ?
      `${window.location.protocol}//${window.location.host}` :
      'https://qxnet.au';

    const ids = selectedCompanies.map(c => c.id).join(',');
    return `${baseUrl}/companies/compare?companies=${ids}`;
  };

  const loadCompaniesFromUrl = (ids: string[]) => {
    const limitedIds = ids.slice(0, 4);
    const companies = limitedIds
      .map(id => companiesData.find(c => c.id === id))
      .filter((c): c is Company => c !== undefined);

    if (companies.length > 0) {
      setSelectedCompanies(companies);
      saveToStorage(companies);
    }
  };

  const value = {
    selectedCompanies,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount,
    isCompareButtonVisible: showCompareButton,
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
