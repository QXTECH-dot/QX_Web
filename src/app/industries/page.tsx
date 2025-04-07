"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight } from 'lucide-react';

// Mock industry data
const industries = [
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial services, banking, investment, and insurance companies.',
    icon: 'https://ext.same-assets.com/1694792166/finance-icon.png',
    companies: 85,
    featuredCompanies: [
      { name: 'FinTech Solutions', logo: 'https://ext.same-assets.com/1694792166/fintech.png' },
      { name: 'Wealth Partners', logo: 'https://ext.same-assets.com/1694792166/wealth.png' },
      { name: 'Secure Invest', logo: 'https://ext.same-assets.com/1694792166/secure.png' },
    ],
  },
  {
    id: 'construction',
    name: 'Construction',
    description: 'Building, construction, architecture, and engineering services.',
    icon: 'https://ext.same-assets.com/1694792166/construction-icon.png',
    companies: 67,
    featuredCompanies: [
      { name: 'BuildTech', logo: 'https://ext.same-assets.com/1694792166/buildtech.png' },
      { name: 'Structure Co', logo: 'https://ext.same-assets.com/1694792166/structure.png' },
      { name: 'Arch Solutions', logo: 'https://ext.same-assets.com/1694792166/arch.png' },
    ],
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Accounting, tax, and financial management services.',
    icon: 'https://ext.same-assets.com/1694792166/accounting-icon.png',
    companies: 42,
    featuredCompanies: [
      { name: 'Tax Experts', logo: 'https://ext.same-assets.com/1694792166/tax.png' },
      { name: 'Accounting Plus', logo: 'https://ext.same-assets.com/1694792166/accountingplus.png' },
      { name: 'Financial Pro', logo: 'https://ext.same-assets.com/1694792166/financialpro.png' },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Educational institutions, training providers, and e-learning platforms.',
    icon: 'https://ext.same-assets.com/1694792166/education-icon.png',
    companies: 53,
    featuredCompanies: [
      { name: 'Learn Fast', logo: 'https://ext.same-assets.com/1694792166/learnfast.png' },
      { name: 'Education Hub', logo: 'https://ext.same-assets.com/1694792166/eduhub.png' },
      { name: 'Skill Academy', logo: 'https://ext.same-assets.com/1694792166/skill.png' },
    ],
  },
  {
    id: 'it',
    name: 'IT & Technology',
    description: 'Information technology, software development, and tech consulting services.',
    icon: 'https://ext.same-assets.com/1694792166/it-icon.png',
    companies: 112,
    featuredCompanies: [
      { name: 'Tech Innovate', logo: 'https://ext.same-assets.com/1694792166/techinnovate.png' },
      { name: 'Digital Solutions', logo: 'https://ext.same-assets.com/1694792166/digital.png' },
      { name: 'CodeCraft', logo: 'https://ext.same-assets.com/1694792166/codecraft.png' },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Healthcare providers, medical services, and health tech companies.',
    icon: 'https://ext.same-assets.com/1694792166/healthcare-icon.png',
    companies: 78,
    featuredCompanies: [
      { name: 'Health Connect', logo: 'https://ext.same-assets.com/1694792166/healthconnect.png' },
      { name: 'MediTech', logo: 'https://ext.same-assets.com/1694792166/meditech.png' },
      { name: 'Care Solutions', logo: 'https://ext.same-assets.com/1694792166/care.png' },
    ],
  },
];

export default function IndustriesPage() {
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
                placeholder="Search for companies or industries..."
                className="w-full py-3 pl-10 pr-4 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Industries List */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Featured Industries</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry) => (
            <div key={industry.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 relative mr-4">
                    <Image
                      src={industry.icon}
                      alt={industry.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{industry.name}</h3>
                </div>

                <p className="text-gray-600 mb-4">{industry.description}</p>

                <div className="mb-4">
                  <span className="text-qxnet font-bold">{industry.companies}</span>
                  <span className="text-gray-500"> companies listed</span>
                </div>

                <div className="flex items-center mb-6">
                  <p className="text-sm text-gray-500 mr-3">Featured:</p>
                  <div className="flex -space-x-2">
                    {industry.featuredCompanies.map((company, index) => (
                      <div key={index} className="w-8 h-8 relative rounded-full overflow-hidden border-2 border-white">
                        <Image
                          src={company.logo}
                          alt={company.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/companies?industry=${industry.id}`}
                  className="flex items-center text-qxnet hover:text-qxnet-700 font-medium"
                >
                  View companies <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Other industries */}
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6">More Industries</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'Legal Services', 'Marketing & Advertising', 'Manufacturing', 'Real Estate',
              'Retail', 'Transport & Logistics', 'Hospitality', 'Agriculture',
              'Media & Entertainment', 'Non-Profit', 'Energy & Utilities', 'Telecommunications'
            ].map((industry, index) => (
              <Link
                key={index}
                href={`/companies?industry=${industry.toLowerCase().replace(/\s+/g, '-')}`}
                className="py-2 px-4 bg-gray-50 hover:bg-qxnet-50 rounded-md text-gray-700 hover:text-qxnet-800 transition-colors"
              >
                {industry}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
