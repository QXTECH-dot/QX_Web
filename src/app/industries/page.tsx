"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Droplets, 
  Wrench, 
  Factory, 
  Leaf, 
  Building, 
  ShoppingBag, 
  Truck, 
  Coffee, 
  Smartphone, 
  CreditCard, 
  Home, 
  Beaker, 
  Briefcase, 
  Activity, 
  BookOpen, 
  HeartPulse, 
  Music, 
  Server
} from 'lucide-react';

// 行业数据
const industries = [
  {
    id: 'agriculture-forestry-fishing',
    name: 'Agriculture, Forestry and Fishing',
    icon: Droplets,
    count: 42
  },
  {
    id: 'mining',
    name: 'Mining',
    icon: Wrench,
    count: 28
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Factory,
    count: 65
  },
  {
    id: 'electricity-gas-water-waste',
    name: 'Electricity, Gas, Water and Waste Services',
    icon: Leaf,
    count: 37
  },
  {
    id: 'construction',
    name: 'Construction',
    icon: Building,
    count: 89
  },
  {
    id: 'wholesale-trade',
    name: 'Wholesale Trade',
    icon: ShoppingBag,
    count: 43
  },
  {
    id: 'retail-trade',
    name: 'Retail Trade',
    icon: ShoppingBag,
    count: 56
  },
  {
    id: 'accommodation-food',
    name: 'Accommodation and Food Services',
    icon: Coffee,
    count: 48
  },
  {
    id: 'transport-postal-warehousing',
    name: 'Transport, Postal and Warehousing',
    icon: Truck,
    count: 39
  },
  {
    id: 'information-media-telecommunications',
    name: 'Information Media and Telecommunications',
    icon: Smartphone,
    count: 74
  },
  {
    id: 'financial-insurance',
    name: 'Financial and Insurance Services',
    icon: CreditCard,
    count: 85
  },
  {
    id: 'rental-hiring-real-estate',
    name: 'Rental, Hiring and Real Estate Services',
    icon: Home,
    count: 57
  },
  {
    id: 'professional-scientific-technical',
    name: 'Professional, Scientific and Technical Services',
    icon: Beaker,
    count: 92
  },
  {
    id: 'administrative-support',
    name: 'Administrative and Support Services',
    icon: Briefcase,
    count: 54
  },
  {
    id: 'public-administration-safety',
    name: 'Public Administration and Safety',
    icon: Activity,
    count: 32
  },
  {
    id: 'education-training',
    name: 'Education and Training',
    icon: BookOpen,
    count: 68
  },
  {
    id: 'health-care-social-assistance',
    name: 'Health Care and Social Assistance',
    icon: HeartPulse,
    count: 76
  },
  {
    id: 'arts-recreation',
    name: 'Arts and Recreation Services',
    icon: Music,
    count: 41
  },
  {
    id: 'other-services',
    name: 'Other Services',
    icon: Server,
    count: 29
  }
];

export default function IndustriesPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <div className="bg-qxnet-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Browse Companies by Industry</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find the right businesses in your industry across Australia. QX Net lists top-rated companies in various sectors.
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for industries..."
                className="w-full py-3 pl-10 pr-4 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Industry Directory */}
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Industry Directory</h1>
          
          {/* Horizontal rows layout */}
          <div className="flex flex-col gap-8">
            {/* Create rows with 3 industries each */}
            {Array.from({ length: Math.ceil(industries.length / 3) }).map((_, rowIndex) => {
              const startIdx = rowIndex * 3;
              const rowIndustries = industries.slice(startIdx, startIdx + 3);
              
              return (
                <div key={rowIndex} className="relative">
                  {/* Connecting line - 仅在非最后一行显示 */}
                  {rowIndex < Math.ceil(industries.length / 3) - 1 && (
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                  )}
                  
                  {/* Industries in this row */}
                  <div className="flex justify-between relative z-10">
                    {rowIndustries.map((industry) => {
                      const IconComponent = industry.icon;
                      const isHovered = hoveredId === industry.id;
                      
                      return (
                        <div
                          key={industry.id}
                          className="w-full max-w-md flex"
                          onMouseEnter={() => setHoveredId(industry.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <Link href={`/companies?industry=${industry.id}`} className="w-full">
                            <div 
                              className={`bg-white rounded-lg border transition-all duration-300 mx-2 h-full flex flex-col
                                ${isHovered 
                                  ? 'border-yellow-300 shadow-lg transform translate-y-px' 
                                  : 'border-gray-200 shadow-sm hover:border-yellow-200'}`}
                            >
                              <div className="p-5 flex flex-col h-full">
                                <div className="flex items-start">
                                  <div 
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0
                                      ${isHovered ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'}`}
                                  >
                                    <IconComponent size={24} />
                                  </div>
                                  <div className="ml-3">
                                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-1">{industry.name}</h3>
                                    <div className="flex items-center">
                                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isHovered ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
                                        <span className="mr-0.5">{industry.count}</span>
                                        <span>companies</span>
                                      </div>
                                    </div>
                  </div>
                </div>

                                <div className="mt-auto pt-4 flex justify-end items-center">
                                  <span 
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                                      ${isHovered 
                                        ? 'bg-yellow-500 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                  >
                                    View →
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                </div>
                      );
                    })}
                    
                    {/* Fill empty slots with placeholder */}
                    {Array.from({ length: 3 - rowIndustries.length }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="w-full max-w-md"></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
