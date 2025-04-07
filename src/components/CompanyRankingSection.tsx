"use client";

import React, { useState, useEffect } from 'react';
import { Globe, MapPin, X, Check } from 'lucide-react';
import { companiesData } from '@/data/companiesData';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Define industry categories for the ranking
const industryCategories = [
  { id: 'finance', name: 'Finance' },
  { id: 'accounting', name: 'Accounting' },
  { id: 'law', name: 'Law' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'it', name: 'IT' },
  { id: 'design', name: 'Design' },
  { id: 'construction', name: 'Construction' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'manufacturing', name: 'Manufacturing' }
];

// Define regions for filtering
const regions = [
  { id: 'all', name: 'All Regions' },
  { id: 'NSW', name: 'NSW' },
  { id: 'VIC', name: 'VIC' },
  { id: 'QLD', name: 'QLD' },
  { id: 'WA', name: 'WA' },
  { id: 'SA', name: 'SA' },
  { id: 'TAS', name: 'TAS' },
  { id: 'ACT', name: 'ACT' },
  { id: 'NT', name: 'NT' }
];

// Define company with ranking information
type RankedCompany = {
  id: string;
  name: string;
  logo: string;
  state: string;
  languages: string[];
  rank: number;
};

// Generate mock companies for each industry
const generateIndustryCompanies = (): Record<string, RankedCompany[]> => {
  const result: Record<string, RankedCompany[]> = {};

  // Sample states
  const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

  // Sample languages
  const languageSets = [
    ['English', 'Spanish', 'French'],
    ['English', 'Mandarin', 'Japanese'],
    ['English', 'Hindi', 'Bengali'],
    ['English', 'German', 'Dutch'],
    ['English', 'Portuguese', 'Italian'],
    ['English', 'Arabic', 'Turkish'],
    ['English', 'Russian', 'Ukrainian'],
    ['English', 'Korean', 'Thai']
  ];

  // Generate 10 companies for each industry
  industryCategories.forEach(industry => {
    // Use real companies with additional mock data
    result[industry.id] = companiesData
      .slice(0, 15)
      .map((company, index) => ({
        id: company.id,
        name: company.name,
        logo: company.logo,
        state: states[Math.floor(Math.random() * states.length)],
        languages: languageSets[Math.floor(Math.random() * languageSets.length)],
        rank: index + 1
      }))
      .slice(0, 10); // Take only 10 companies per industry
  });

  return result;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      when: "afterChildren",
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: { duration: 0.2 }
  }
};

const headerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

// Prepare the data
const industryCompanies = generateIndustryCompanies();

export function CompanyRankingSection() {
  const [activeIndustry, setActiveIndustry] = useState<string>(industryCategories[0].id);
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState<number>(5);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isChanging, setIsChanging] = useState<boolean>(false);

  // Filter companies by region
  const filteredCompanies = (industryId: string, regionId: string) => {
    if (regionId === 'all') {
      return industryCompanies[industryId];
    }
    return industryCompanies[industryId].filter(company => company.state === regionId);
  };

  // Get background color based on ranking
  const getRankingBackground = (rank: number) => {
    if (rank === 1) return 'bg-qxnet-400 text-black'; // Gold for first
    if (rank === 2) return 'bg-qxnet-50 text-gray-800'; // Silver for second
    if (rank === 3) return 'bg-qxnet-100 text-gray-800'; // Bronze for third
    return 'bg-gray-100 text-gray-700'; // Default for others
  };

  const getRankingSize = (rank: number) => {
    if (rank === 1) return 'w-10 h-10';
    if (rank === 2) return 'w-9 h-9';
    if (rank === 3) return 'w-9 h-9';
    return 'w-8 h-8';
  };

  // Handle expanding/collapsing the list
  const toggleExpand = () => {
    setDisplayCount(isExpanded ? 5 : 10);
    setIsExpanded(!isExpanded);
  };

  // Handle tab change with animation
  const handleIndustryChange = (industryId: string) => {
    setIsChanging(true);
    setTimeout(() => {
      setActiveIndustry(industryId);
      setIsChanging(false);
    }, 300);
  };

  // Handle region change with animation
  const handleRegionChange = (regionId: string) => {
    setIsChanging(true);
    setTimeout(() => {
      setActiveRegion(regionId);
      setIsChanging(false);
    }, 200);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col">
          <motion.h2
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Industry Rankings
          </motion.h2>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto scrollbar-hide mb-4 pb-2 border-b border-gray-200">
            {industryCategories.map((industry, index) => (
              <motion.button
                key={industry.id}
                onClick={() => handleIndustryChange(industry.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05
                }}
                className={`px-4 py-2 mr-2 whitespace-nowrap transition-all duration-300 ${
                  activeIndustry === industry.id
                    ? 'text-black font-semibold border-b-2 border-qxnet-400'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {industry.name}
              </motion.button>
            ))}
          </div>

          {/* Region Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {regions.map((region, index) => (
              <motion.button
                key={region.id}
                onClick={() => handleRegionChange(region.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03
                }}
                className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${
                  activeRegion === region.id
                    ? 'bg-qxnet-50 text-black font-medium border border-qxnet-400'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {region.name}
              </motion.button>
            ))}
          </div>

          {/* Company Listings */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            <motion.div
              className="p-4 border-b border-gray-100 bg-gray-50"
              variants={headerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-lg font-semibold">{industryCategories.find(i => i.id === activeIndustry)?.name} Companies</h3>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndustry}-${activeRegion}`}
                className="divide-y divide-gray-100"
                variants={containerVariants}
                initial="hidden"
                animate={isChanging ? "exit" : "visible"}
                exit="exit"
              >
                {filteredCompanies(activeIndustry, activeRegion).slice(0, displayCount).map((company, index) => (
                  <motion.div
                    key={company.id}
                    variants={itemVariants}
                    custom={index}
                    className="p-4 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm transform hover:scale-[1.01]"
                  >
                    <div className="flex items-center">
                      <motion.div
                        className={`${getRankingBackground(company.rank)} ${getRankingSize(company.rank)}
                          rounded-full flex items-center justify-center font-semibold mr-4
                          shadow-sm transition-all duration-300`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {company.rank}
                      </motion.div>
                      <motion.div
                        className="relative w-12 h-12 rounded-md overflow-hidden bg-white mr-4 border border-gray-100 shadow-sm"
                        whileHover={{ scale: 1.05, rotate: 0 }}
                      >
                        <Image
                          src={company.logo}
                          alt={`${company.name} logo`}
                          fill
                          className="object-contain p-1"
                        />
                      </motion.div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm">
                          <Link href={`/company/${company.id}`} className="hover:text-qxnet-500 transition-colors">
                            {company.name}
                          </Link>
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          <span>{company.state}</span>
                        </div>

                        {/* Enhanced language display */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {company.languages.map((language, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 + (idx * 0.05) }}
                              whileHover={{ scale: 1.1 }}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs
                                bg-gray-100 text-gray-700 border border-gray-200"
                            >
                              <Globe className="h-2.5 w-2.5 mr-1 text-qxnet-400" />
                              {language}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredCompanies(activeIndustry, activeRegion).length === 0 && (
                  <motion.div
                    className="p-8 text-center text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    No companies found for this combination of filters.
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {filteredCompanies(activeIndustry, activeRegion).length > 5 && (
              <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                <motion.button
                  onClick={toggleExpand}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-qxnet-500 hover:text-qxnet-700 font-medium
                    transition-colors flex items-center justify-center mx-auto"
                >
                  {isExpanded ? (
                    <>
                      <X className="h-4 w-4 mr-1" /> Show less
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Show more ({filteredCompanies(activeIndustry, activeRegion).length - displayCount})
                    </>
                  )}
                </motion.button>
              </div>
            )}

            <div className="p-3 bg-qxnet-50 text-center border-t border-gray-100">
              <motion.div
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  href={`/companies?industry=${activeIndustry}${activeRegion !== 'all' ? `&region=${activeRegion}` : ''}`}
                  className="text-sm text-qxnet-700 hover:text-qxnet-900 font-medium hover:underline
                    transition-colors inline-flex items-center"
                >
                  View all {industryCategories.find(i => i.id === activeIndustry)?.name} companies
                  {activeRegion !== 'all' && ` in ${activeRegion}`}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
