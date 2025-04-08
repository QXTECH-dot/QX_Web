"use client";

import React, { useState, useMemo } from 'react';
import { Star, MapPin, Building2, Globe, Users, Mail, Phone, ExternalLink, X, ChevronDown, Filter } from 'lucide-react';
import Sidebar from '@/components/crm/shared/layout/Sidebar';
import { Button } from '@/components/ui/button';

interface SavedCompany {
  id: string;
  name: string;
  logo: string;
  location: string;
  description: string;
  verified: boolean;
  teamSize: string;
  languages: string[];
  services: string[];
  industries: string[];
  abn?: string;
}

export default function SavedCompaniesPage() {
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>([
    {
      id: '1',
      name: 'Tech Solutions Australia',
      logo: '/company-logos/tech-au.png',
      location: 'Sydney, Australia',
      description: 'Leading provider of innovative technology solutions focused on digital transformation and enterprise software development.',
      verified: true,
      teamSize: '50-100',
      languages: ['English', 'Chinese', 'Hindi'],
      services: ['Web Development', 'Mobile Apps', 'Cloud Solutions'],
      industries: ['Information Technology'],
      abn: '12345678901'
    },
    {
      id: '2',
      name: 'Green Energy New Zealand',
      logo: '/company-logos/green-nz.png',
      location: 'Wellington, New Zealand',
      description: 'Sustainable energy solutions provider specializing in renewable technology and clean energy innovations.',
      verified: true,
      teamSize: '20-50',
      languages: ['English', 'Maori'],
      services: ['Renewable Energy', 'Sustainability Consulting', 'Green Technology'],
      industries: ['Energy & Environment'],
    },
    {
      id: '3',
      name: 'Digital Marketing Pro',
      logo: '/company-logos/digital-pro.png',
      location: 'Melbourne, Australia',
      description: 'Full-service digital marketing agency offering SEO, social media management, and content marketing strategies for businesses across APAC.',
      verified: true,
      teamSize: '10-20',
      languages: ['English', 'Japanese', 'Korean'],
      services: ['Digital Marketing', 'SEO Services', 'Social Media Management', 'Content Creation'],
      industries: ['Marketing & Advertising'],
    },
    {
      id: '4',
      name: 'FinTech Solutions Ltd',
      logo: '/company-logos/fintech.png',
      location: 'Singapore, Singapore',
      description: 'Innovative financial technology company providing cutting-edge payment solutions and blockchain integration services.',
      verified: true,
      teamSize: '100-200',
      languages: ['English', 'Chinese', 'Malay'],
      services: ['Payment Solutions', 'Blockchain Development', 'Financial Software'],
      industries: ['Financial Technology'],
    },
    {
      id: '5',
      name: 'Healthcare Innovations',
      logo: '/company-logos/health-tech.png',
      location: 'Brisbane, Australia',
      description: 'Healthcare technology provider developing innovative solutions for hospitals and medical practices, including telemedicine platforms.',
      verified: false,
      teamSize: '20-50',
      languages: ['English', 'Vietnamese'],
      services: ['Healthcare Software', 'Telemedicine Solutions', 'Medical Data Analytics'],
      industries: ['Healthcare Technology'],
    },
    {
      id: '6',
      name: 'Education Tech Systems',
      logo: '/company-logos/edu-tech.png',
      location: 'Auckland, New Zealand',
      description: 'Leading education technology company providing e-learning platforms and digital curriculum solutions for schools and universities.',
      verified: true,
      teamSize: '50-100',
      languages: ['English', 'Chinese', 'Hindi', 'Maori'],
      services: ['E-Learning Platforms', 'Digital Content Creation', 'Educational Software'],
      industries: ['Education Technology'],
    }
  ]);

  // Add filter states
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // Extract unique states and industries
  const states = useMemo(() => {
    const stateSet = new Set(savedCompanies.map(company => company.location.split(', ')[1]));
    return Array.from(stateSet);
  }, [savedCompanies]);

  const industries = useMemo(() => {
    const industrySet = new Set(savedCompanies.flatMap(company => company.industries));
    return Array.from(industrySet);
  }, [savedCompanies]);

  // Filter companies based on selected states and industries
  const filteredCompanies = useMemo(() => {
    return savedCompanies.filter(company => {
      const companyState = company.location.split(', ')[1];
      const stateMatch = selectedStates.length === 0 || selectedStates.includes(companyState);
      const industryMatch = selectedIndustries.length === 0 || 
        company.industries.some(industry => selectedIndustries.includes(industry));
      return stateMatch && industryMatch;
    });
  }, [savedCompanies, selectedStates, selectedIndustries]);

  // Toggle filter handlers
  const toggleState = (state: string) => {
    setSelectedStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const handleRemove = (id: string) => {
    setSavedCompanies(companies => companies.filter(company => company.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-xl font-bold">Saved Companies</h1>
              <div className="flex items-start gap-4">
                {/* Filters */}
                <div className="flex flex-col items-end gap-2">
                  <div className="text-gray-600 text-sm">
                    {filteredCompanies.length} companies saved
                  </div>
                  <div className="flex gap-3">
                    {/* State Filter */}
                    <div className="relative group">
                      <Button 
                        variant="outline" 
                        className="text-sm border border-gray-300 hover:border-gray-400 hover:shadow-sm text-gray-700 flex items-center gap-2 min-w-[120px] justify-between bg-white transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          <span>State</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {selectedStates.length > 0 && (
                            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs font-medium">
                              {selectedStates.length}
                            </span>
                          )}
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </Button>
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-56 hidden group-hover:block z-10">
                        <div className="p-2 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700">Filter by State</h3>
                        </div>
                        <div className="max-h-[240px] overflow-y-auto py-1">
                          {states.map(state => (
                            <label 
                              key={state} 
                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                            >
                              <input
                                type="checkbox"
                                checked={selectedStates.includes(state)}
                                onChange={() => toggleState(state)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="text-sm text-gray-700">{state}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Industry Filter */}
                    <div className="relative group">
                      <Button 
                        variant="outline" 
                        className="text-sm border border-gray-300 hover:border-gray-400 hover:shadow-sm text-gray-700 flex items-center gap-2 min-w-[120px] justify-between bg-white transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          <span>Industry</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {selectedIndustries.length > 0 && (
                            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs font-medium">
                              {selectedIndustries.length}
                            </span>
                          )}
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </Button>
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-56 hidden group-hover:block z-10">
                        <div className="p-2 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700">Filter by Industry</h3>
                        </div>
                        <div className="max-h-[240px] overflow-y-auto py-1">
                          {industries.map(industry => (
                            <label 
                              key={industry} 
                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                            >
                              <input
                                type="checkbox"
                                checked={selectedIndustries.includes(industry)}
                                onChange={() => toggleIndustry(industry)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="text-sm text-gray-700">{industry}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Filters */}
                  {(selectedStates.length > 0 || selectedIndustries.length > 0) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedStates.map(state => (
                        <span 
                          key={state}
                          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          <span className="text-gray-500 text-xs mr-1">State:</span>
                          {state}
                          <button 
                            onClick={() => toggleState(state)}
                            className="hover:bg-gray-200 rounded-full p-0.5 ml-1 transition-colors duration-150"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                      {selectedIndustries.map(industry => (
                        <span 
                          key={industry}
                          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          <span className="text-gray-500 text-xs mr-1">Industry:</span>
                          {industry}
                          <button 
                            onClick={() => toggleIndustry(industry)}
                            className="hover:bg-gray-200 rounded-full p-0.5 ml-1 transition-colors duration-150"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredCompanies.map(company => (
                <div 
                  key={company.id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex gap-4">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-semibold flex items-center gap-2">
                            {company.name}
                            {company.verified && (
                              <span className="text-primary">
                                <Star className="w-4 h-4 fill-current" />
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-gray-600 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{company.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>{company.industries[0]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              <span>{company.teamSize}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="default"
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white h-8"
                          >
                            View Profile
                            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-primary border-primary hover:bg-primary/10 h-8"
                          >
                            Compare
                          </Button>
                        </div>
                      </div>

                      <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                        {company.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Services:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {company.services.slice(0, 3).map((service, index) => (
                              <span 
                                key={index}
                                className="bg-blue-50 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                              >
                                {service}
                              </span>
                            ))}
                            {company.services.length > 3 && (
                              <span className="text-gray-500 text-xs">
                                +{company.services.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Languages:</span>
                          <div className="flex items-center gap-1">
                            {company.languages.map((language, index) => (
                              <span 
                                key={index}
                                className="text-primary text-sm"
                              >
                                {language}
                                {index < company.languages.length - 1 && ", "}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                <Star className="mx-auto text-gray-400 mb-2" size={40} />
                <h3 className="text-base font-medium text-gray-900 mb-1">No Companies Found</h3>
                <p className="text-sm text-gray-600">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 