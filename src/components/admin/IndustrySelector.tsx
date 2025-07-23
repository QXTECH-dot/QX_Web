'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface IndustryCategory {
  id: string;
  popular_name: string;
  popular_code: string;
  level: number;
  division_code?: string;
  division_title?: string;
  subdivision_code?: string;
  subdivision_title?: string;
  name?: string;
  name_en?: string;
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

  // 分级获取行业选项
  const level1Industries = industries
    .filter(item => item.level === 1)
    .sort((a, b) => a.popular_name.localeCompare(b.popular_name));
    
  const level2Industries = industries.filter(item => {
    if (item.level !== 2) return false;
    if (!selectedIndustry1) return false;
    // 根据division_code匹配上级行业
    const parent = industries.find(ind => ind.level === 1 && ind.popular_name === selectedIndustry1);
    return parent && item.division_code === parent.division_code;
  }).sort((a, b) => a.popular_name.localeCompare(b.popular_name));
  
  const level3Industries = industries.filter(item => {
    if (item.level !== 3) return false;
    if (!selectedIndustry2) return false;
    // 根据division_code和subdivision_code匹配上级行业
    const parent = industries.find(ind => ind.level === 2 && ind.popular_name === selectedIndustry2);
    if (!parent) return false;
    // Level 3需要匹配division_code和subdivision_code
    return item.division_code === parent.division_code && 
           item.subdivision_code === parent.subdivision_code;
  }).sort((a, b) => a.popular_name.localeCompare(b.popular_name));

  // 加载行业数据
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!db) {
          throw new Error('Firebase not initialized');
        }

        const industriesRef = collection(db, 'industry_classifications');
        const snapshot = await getDocs(industriesRef);
        
        const data: IndustryCategory[] = [];
        snapshot.forEach(doc => {
          const docData = doc.data();
          // 根据级别决定显示名称
          let displayName = 'Unknown';
          if (docData.level === 1) {
            displayName = docData.division_title || 'Unknown';
          } else if (docData.level === 2) {
            displayName = docData.subdivision_title || 'Unknown';
          } else if (docData.level === 3) {
            displayName = docData.popular_name || 'Unknown';
          }
          
          data.push({ 
            id: doc.id, 
            popular_name: displayName,
            popular_code: docData.popular_code || doc.id,
            level: docData.level || 3,
            division_code: docData.division_code || '',
            division_title: docData.division_title || '',
            subdivision_code: docData.subdivision_code || '',
            subdivision_title: docData.subdivision_title || '',
            name: docData.name,
            name_en: docData.name_en
          } as IndustryCategory);
        });

        setIndustries(data);
        console.log(`Loaded ${data.length} industry classifications`);
        
        // 显示一些统计信息
        const level1Count = data.filter(item => item.level === 1).length;
        const level2Count = data.filter(item => item.level === 2).length;
        const level3Count = data.filter(item => item.level === 3).length;
        
        console.log(`Industry statistics: Level1=${level1Count}, Level2=${level2Count}, Level3=${level3Count}`);
        
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
  const handleIndustry1Change = (value: string) => {
    onSelectionChange(value, '', '');
  };

  // 处理二级行业选择
  const handleIndustry2Change = (value: string) => {
    onSelectionChange(selectedIndustry1, value, '');
  };

  // 处理三级行业选择
  const handleIndustry3Change = (value: string) => {
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
          Level 1 Industry
        </label>
        <select
          value={selectedIndustry1}
          onChange={(e) => handleIndustry1Change(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          <option value="">Select Level 1 Industry</option>
          {level1Industries.map((industry) => (
            <option key={industry.id} value={industry.popular_name}>
              {industry.popular_name}
            </option>
          ))}
        </select>
      </div>

      {/* 二级行业选择 */}
      {selectedIndustry1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level 2 Industry
          </label>
          <select
            value={selectedIndustry2}
            onChange={(e) => handleIndustry2Change(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Select Level 2 Industry</option>
            {level2Industries.map((industry) => (
              <option key={industry.id} value={industry.popular_name}>
                {industry.popular_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 三级行业选择 */}
      {selectedIndustry2 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level 3 Industry
          </label>
          <select
            value={selectedIndustry3}
            onChange={(e) => handleIndustry3Change(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Select Level 3 Industry</option>
            {level3Industries.map((industry) => (
              <option key={industry.id} value={industry.popular_name}>
                {industry.popular_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 选择预览 */}
      {(selectedIndustry1 || selectedIndustry2 || selectedIndustry3) && (
        <div className="p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Industries:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {selectedIndustry1 && <div><strong>Level 1:</strong> {selectedIndustry1}</div>}
            {selectedIndustry2 && <div><strong>Level 2:</strong> {selectedIndustry2}</div>}
            {selectedIndustry3 && <div><strong>Level 3:</strong> {selectedIndustry3}</div>}
          </div>
        </div>
      )}
    </div>
  );
}