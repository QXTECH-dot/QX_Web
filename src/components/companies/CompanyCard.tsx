"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building, MapPin, CheckCircle, Check, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { HighlightedCompanyName, HighlightedDescription } from "@/components/search/HighlightedResult";
import { useComparison } from "@/components/comparison/ComparisonContext";
import { Company, Office } from "@/types/company";
import { formatABN } from "@/utils/abnFormat";
import app from "@/lib/firebase/client";
import { getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

// 语言代码映射
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'th', label: 'Thai' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'id', label: 'Indonesian' },
  { value: 'ms', label: 'Malay' },
  { value: 'tl', label: 'Filipino' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'ur', label: 'Urdu' },
  { value: 'bn', label: 'Bengali' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'kn', label: 'Kannada' },
  { value: 'gu', label: 'Gujarati' }
];

// 语言代码转换为全名的函数
const getLanguageDisplayName = (langCode: string) => {
  const lang = languageOptions.find(l => l.value === langCode);
  return lang ? lang.label : langCode;
};

// 处理语言数组显示
const formatLanguages = (languages: string | string[] | undefined) => {
  if (!languages) return 'No languages specified';
  if (typeof languages === 'string') {
    return getLanguageDisplayName(languages);
  }
  if (Array.isArray(languages)) {
    const displayNames = languages.map(getLanguageDisplayName);
    if (displayNames.length <= 3) {
      return displayNames.join(', ');
    }
    return `${displayNames.slice(0, 3).join(', ')} + See more`;
  }
  return 'No languages specified';
};

interface Service {
  serviceId: string;
  companyId: string;
  title: string;
  description: string;
}

interface CompanyCardProps {
  id: string;
  slug?: string;  // 新增slug字段
  name_en: string;
  logo: string;
  location: string;
  description: string;
  verified?: boolean;
  teamSize?: string;
  languages?: string | string[];
  services?: string | string[];
  abn?: string;
  industries?: string | string[];
  offices?: Office[];
  second_industry?: string;
  third_industry?: string;
}

export function CompanyCard({
  id,
  slug,
  name_en = '',
  logo,
  location = '',
  description = '',
  verified = false,
  teamSize = '',
  languages = [],
  services = [],
  abn,
  industries = [],
  offices = [],
  second_industry,
  third_industry,
}: CompanyCardProps) {
  // Get search query from URL to highlight matching text
  const searchParams = useSearchParams?.();
  const searchQuery = searchParams?.get('query') || '';

  // Services state
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Comparison functionality
  const {
    isInComparison,
    addToComparison,
    removeFromComparison,
    comparisonCount
  } = useComparison();

  const inComparison = isInComparison(id);
  const maxReached = comparisonCount >= 4 && !inComparison;

  // Fetch services data
  useEffect(() => {
    const fetchServices = async () => {
      if (!id) return;
      
      setServicesLoading(true);
      try {
        const db = getFirestore(app);
        
        // 首先获取公司信息，确定companyId
        let companyId = '';
        
        // 先尝试按slug查找公司
        const companiesRef = collection(db, 'companies');
        const slugQuery = query(companiesRef, where('slug', '==', slug || id));
        const slugSnapshot = await getDocs(slugQuery);
        
        if (!slugSnapshot.empty) {
          const companyData = slugSnapshot.docs[0].data();
          companyId = companyData.companyId || slugSnapshot.docs[0].id;
        } else {
          // 如果按slug找不到，尝试按ID查找
          const companyRef = doc(db, 'companies', id);
          const companySnap = await getDoc(companyRef);
          if (companySnap.exists()) {
            const companyData = companySnap.data();
            companyId = companyData.companyId || companySnap.id;
          }
        }
        
        if (!companyId) {
          console.log('Could not find companyId for:', id);
          setServicesLoading(false);
          return;
        }
        
        // 使用companyId查询services
        const servicesCol = collection(db, 'services');
        const q = query(servicesCol, where('companyId', '==', companyId));
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const servicesData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              serviceId: doc.id,
              companyId: data.companyId,
              title: data.title,
              description: data.description
            };
          });
          setServicesData(servicesData);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, [id, slug]);

  const toggleComparison = () => {
    if (inComparison) {
      removeFromComparison(id);
    } else if (!maxReached) {
      // Create a company object from props to add to comparison
      const company: Company = {
        id,
        name_en,
        name: name_en,
        logo,
        shortDescription: description,
        description: description,
        teamSize,
        languages: Array.isArray(languages) ? languages : (languages ? [languages] : []),
        abn,
        industry: Array.isArray(industries) ? industries : (typeof industries === 'string' ? [industries] : []),
        services: Array.isArray(services) ? services : (services ? [services] : []),
        location,
        // foundedYear: undefined,
        // social: undefined
      };
      addToComparison(company);
    }
  };

  // 处理州信息
  const getDisplayedStates = () => {
    if (!offices || offices.length === 0) {
      // 没有办公室信息，尝试从location中提取州
      const parts = location?.split(', ');
      return parts && parts.length > 1 ? [parts[parts.length - 1].split(' ')[0]] : [];
    }
    // 提取所有有效state并去重
    const allStates = Array.from(new Set(offices.map(office => office.state).filter(s => !!s && s !== 'N/A')));
    if (allStates.length === 0) return [];
    // 排序
    allStates.sort();
    // 最多显示3个
    const displayedStates = allStates.slice(0, 3);
    if (allStates.length > 3) {
      return [...displayedStates, '+ more'];
    }
    return displayedStates;
  };

  const displayedStates = getDisplayedStates();

  // State to track if the logo image has loaded successfully
  const [logoError, setLogoError] = useState(false);

  // 防御性处理，确保为数组
  services = Array.isArray(services) ? services : (services ? [services] : []);
  languages = Array.isArray(languages) ? languages : (languages ? [languages] : []);
  industries = Array.isArray(industries) ? industries : (industries ? [industries] : []);
  
  // 调试日志
  console.log(`🔍 CompanyCard ${name_en} (${id}) - services:`, services);
  console.log(`🔍 CompanyCard ${name_en} (${id}) - logo:`, logo);

  // 获取要显示的services（优先使用从services集合获取的数据）
  const displayServices = servicesData.length > 0 
    ? servicesData.map(service => service.title)
    : services;

  return (
    <Card className="overflow-hidden flex flex-col h-full border border-gray-200 relative company-card">
      {/* Comparison checkbox */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className={`w-6 h-6 rounded border flex items-center justify-center
            ${inComparison ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}
            ${maxReached ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}`}
          onClick={toggleComparison}
          disabled={maxReached}
          aria-label={inComparison ? "Remove from comparison" : "Add to comparison"}
          title={maxReached ? "Maximum 4 companies for comparison" : (inComparison ? "Remove from comparison" : "Add to comparison")}
        >
          {inComparison && <Check className="h-4 w-4 text-white" />}
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-start">
          {/* Company Logo */}
          <div className="w-28 h-20 bg-white shadow-sm rounded mr-4 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {logo && !logoError ? (
              <img
                src={logo}
                alt={`${name_en} logo`}
                onError={() => setLogoError(true)}
                className="w-full h-full object-cover transition-opacity duration-200"
                loading="lazy"
                decoding="async"
                onLoad={(e) => {
                  // 图片加载完成后的淡入效果
                  (e.target as HTMLImageElement).style.opacity = '1';
                }}
                style={{ opacity: 0 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <Building className="h-10 w-10 text-gray-400" />
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            {/* Use highlighted name for search results */}
            {searchQuery ? (
              <HighlightedCompanyName name={name_en} query={searchQuery} />
            ) : (
              <div className="h-[3.5rem] flex flex-col justify-start">
                <h3 className="font-bold text-lg line-clamp-2 break-words">
                  {name_en}
                  {verified && (
                    <CheckCircle className="inline-block h-5 w-5 text-primary ml-1" fill="white" strokeWidth={2} />
                  )}
                </h3>
              </div>
            )}

            {/* Location - 显示处理后的州信息 */}
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{displayedStates.length > 0 ? displayedStates.join(', ') : 'N/A'}</span>
            </div>

            {/* ABN号码显示 */}
            {abn && (
              <div className="flex items-center text-gray-600 mb-1">
                <Globe className="h-4 w-4 mr-1" />
                <span className="text-sm">ABN: {formatABN(abn)}</span>
              </div>
            )}

            {/* 行业标签渲染 - 字体与state一致 */}
            {industries.length > 0 && (
              <div className="flex items-center text-gray-900 mb-1">
                <Building className="h-4 w-4 mr-1" />
                <span className="text-sm">{industries.join(', ')}</span>
              </div>
            )}

            {/* 只展示第三行业，风格与地址一致 */}
            {third_industry && (
              <div className="flex items-center text-gray-600 mb-1">
                <Building className="h-4 w-4 mr-1" />
                <span className="text-sm">{third_industry}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description with highlighting */}
        {searchQuery ? (
          <HighlightedDescription description={description} query={searchQuery} />
        ) : (
          <div className="h-[4.5rem] my-6">
            <p className="text-sm text-gray-700 line-clamp-3">
              {description}
            </p>
          </div>
        )}

        {/* Languages */}
        <div className="mb-4">
          <h4 className="text-gray-700 font-semibold mb-2">Languages</h4>
          <div className="h-[2.5rem]">
            <p className="text-base text-[#E6B800]">
              {formatLanguages(languages)}
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h4 className="text-gray-700 font-semibold mb-2">Services:</h4>
          <div className="flex flex-wrap gap-2 h-[5.5rem] overflow-hidden">
            {displayServices.length > 0 ? (
              <>
                {displayServices.slice(0, 3).map((service, index) => (
                  <span key={index} className="px-4 py-2 rounded text-sm bg-[#FFFCF5] text-[#E6B800]">
                    {service}
                  </span>
                ))}
                {displayServices.length > 3 && (
                  <span className="px-4 py-2 rounded text-sm bg-[#FFFCF5] text-[#E6B800]">
                    + See more
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-sm italic">No services listed</span>
            )}
          </div>
        </div>

        <hr className="my-4" />

        {/* Action Buttons */}
        <div className="flex justify-between gap-2">
          <Link href={`/company/${slug || id}`} className="flex-1">
            <Button variant="outline" className="w-full border-2 border-gray-800 text-gray-800 hover:bg-gray-100">
              View profile
            </Button>
          </Link>

          <Button
            onClick={toggleComparison}
            disabled={maxReached && !inComparison}
            className={`w-32 border-2 bg-[#FFFCF5] text-[#E6B800] border-[#E6B800] ${
              inComparison
                ? 'bg-gray-200 text-primary border-primary hover:bg-gray-300'
                : maxReached
                  ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                  : 'hover:bg-primary hover:text-white'
            }`}
          >
            {inComparison ? 'Remove' : 'Compare'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
