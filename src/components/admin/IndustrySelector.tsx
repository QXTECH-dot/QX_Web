'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface IndustryCategory {
  id: string;
  level1: string;
  level2: string;
  level3: string | null;
  level1_code: string;
  level2_code: string;
  level3_code: string | null;
}

interface IndustrySelectorProps {
  selectedIndustry1?: string;
  selectedIndustry2?: string;
  selectedIndustry3?: string;
  onSelectionChange: (industry1: string, industry2: string, industry3: string) => void;
  className?: string;
}

export default function IndustrySelector({
  selectedIndustry1 = '',
  selectedIndustry2 = '',
  selectedIndustry3 = '',
  onSelectionChange,
  className = ''
}: IndustrySelectorProps) {
  const [industries, setIndustries] = useState<IndustryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 提取选项
  const level1Options = Array.from(new Set(industries.map(item => item.level1))).sort();
  const level2Options = selectedIndustry1 
    ? Array.from(new Set(
        industries
          .filter(item => item.level1 === selectedIndustry1)
          .map(item => item.level2)
      )).sort()
    : [];
  const level3Options = selectedIndustry1 && selectedIndustry2
    ? Array.from(new Set(
        industries
          .filter(item => item.level1 === selectedIndustry1 && item.level2 === selectedIndustry2)
          .map(item => item.level3)
          .filter(Boolean)
      )).sort()
    : [];

  // 加载行业数据
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!db) {
          throw new Error('Firebase not initialized');
        }

        const industriesRef = collection(db, 'industry_categories');
        const snapshot = await getDocs(industriesRef);
        
        const data: IndustryCategory[] = [];
        snapshot.forEach(doc => {
          data.push({ id: doc.id, ...doc.data() } as IndustryCategory);
        });

        setIndustries(data);
        console.log(`Loaded ${data.length} industry categories`);
        
        // 显示一些统计信息
        const uniqueLevel1 = new Set(data.map(item => item.level1)).size;
        const uniqueLevel2 = new Set(data.map(item => `${item.level1}::${item.level2}`)).size;
        const uniqueLevel3 = data.filter(item => item.level3).length;
        
        console.log(`Industry statistics: L1=${uniqueLevel1}, L2=${uniqueLevel2}, L3=${uniqueLevel3}`);
        
      } catch (err) {
        console.error('Error fetching industries:', err);
        setError(err instanceof Error ? err.message : 'Failed to load industries');
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  // 处理一级行业选择
  const handleLevel1Change = (value: string) => {
    onSelectionChange(value, '', '');
  };

  // 处理二级行业选择
  const handleLevel2Change = (value: string) => {
    onSelectionChange(selectedIndustry1, value, '');
  };

  // 处理三级行业选择
  const handleLevel3Change = (value: string) => {
    onSelectionChange(selectedIndustry1, selectedIndustry2, value);
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-md ${className}`}>
        <p className="text-red-600 text-sm">Error loading industries: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-red-700 underline text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 一级行业选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Primary Industry (Level 1) *
        </label>
        <select
          value={selectedIndustry1}
          onChange={(e) => handleLevel1Change(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          <option value="">Select Primary Industry</option>
          {level1Options.map((option, index) => (
            <option key={`level1-${index}`} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* 二级行业选择 */}
      {selectedIndustry1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Secondary Industry (Level 2) *
          </label>
          <select
            value={selectedIndustry2}
            onChange={(e) => handleLevel2Change(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Select Secondary Industry</option>
            {level2Options.map((option, index) => (
              <option key={`level2-${index}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 三级行业选择 */}
      {selectedIndustry1 && selectedIndustry2 && level3Options.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specific Industry (Level 3)
          </label>
          <select
            value={selectedIndustry3}
            onChange={(e) => handleLevel3Change(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Select Specific Industry (Optional)</option>
            {level3Options.map((option, index) => (
              <option key={`level3-${index}`} value={option || ''}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 选择预览 */}
      {selectedIndustry1 && (
        <div className="p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Classification:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Primary:</strong> {selectedIndustry1}</div>
            {selectedIndustry2 && <div><strong>Secondary:</strong> {selectedIndustry2}</div>}
            {selectedIndustry3 && <div><strong>Specific:</strong> {selectedIndustry3}</div>}
          </div>
        </div>
      )}

      {/* 统计信息 */}
      <div className="text-xs text-gray-500">
        Available: {level1Options.length} primary, {level2Options.length} secondary, {level3Options.length} specific industries
      </div>
    </div>
  );
}