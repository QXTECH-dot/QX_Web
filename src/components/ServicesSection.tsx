"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Building, Code, Layout, PenTool, Banknote } from "lucide-react";

const industryCategories = [
  {
    id: "finance",
    name: "Finance",
    icon: <Banknote className="h-6 w-6 text-primary" />,
    services: [
      { name: "Investment & Wealth Management", link: "/companies/investment-wealth-management" },
      { name: "Loans & Financing", link: "/companies/loans-financing" },
      { name: "Web3 & Cryptocurrency", link: "/companies/web3-cryptocurrency" },
      { name: "Financial Planning", link: "/companies/financial-planning" },
      { name: "Insurance", link: "/companies/insurance" },
      { name: "Banking Services", link: "/companies/banking-services" },
      { name: "Payment Processing", link: "/companies/payment-processing" },
      { name: "Accounting & Bookkeeping", link: "/companies/accounting" },
      { name: "Tax Services", link: "/companies/tax-services" },
      { name: "Financial Consulting", link: "/companies/financial-consulting" },
      { name: "Investment Banking", link: "/companies/investment-banking" },
      { name: "Financial Risk Management", link: "/companies/risk-management" },
    ],
  },
  {
    id: "it",
    name: "IT",
    icon: <Code className="h-6 w-6 text-primary" />,
    services: [
      { name: "Web Development", link: "/companies/web-development" },
      { name: "App Development", link: "/companies/app-development" },
      { name: "Cloud Services", link: "/companies/cloud-services" },
      { name: "Artificial Intelligence", link: "/companies/ai" },
      { name: "SEO & Digital Marketing", link: "/companies/seo" },
      { name: "Cybersecurity", link: "/companies/cybersecurity" },
      { name: "IT Consulting", link: "/companies/it-consulting" },
      { name: "Database Management", link: "/companies/database-management" },
      { name: "DevOps", link: "/companies/devops" },
      { name: "IT Infrastructure", link: "/companies/it-infrastructure" },
      { name: "Blockchain Development", link: "/companies/blockchain" },
      { name: "Data Analytics", link: "/companies/data-analytics" },
    ],
  },
  {
    id: "property",
    name: "Property",
    icon: <Building className="h-6 w-6 text-primary" />,
    services: [
      { name: "Property Management", link: "/companies/property-management" },
      { name: "Real Estate Agency", link: "/companies/real-estate-agency" },
      { name: "Property Valuation", link: "/companies/property-valuation" },
      { name: "Leasing Services", link: "/companies/leasing-services" },
      { name: "Property Investment", link: "/companies/property-investment" },
      { name: "Commercial Property", link: "/companies/commercial-property" },
      { name: "Residential Property", link: "/companies/residential-property" },
      { name: "Property Maintenance", link: "/companies/property-maintenance" },
      { name: "Property Development", link: "/companies/property-development" },
      { name: "Land Sales", link: "/companies/land-sales" },
      { name: "Auction Services", link: "/companies/auction-services" },
      { name: "Strata Management", link: "/companies/strata-management" },
    ],
  },
  {
    id: "construction",
    name: "Construction",
    icon: <Building className="h-6 w-6 text-primary" />,
    services: [
      { name: "House Building", link: "/companies/house-building" },
      { name: "Pool Construction", link: "/companies/pool-construction" },
      { name: "Drywall Installation", link: "/companies/drywall" },
      { name: "Ceiling Installation", link: "/companies/ceilings" },
      { name: "Commercial Construction", link: "/companies/commercial-construction" },
      { name: "Roofing", link: "/companies/roofing" },
      { name: "Plumbing Services", link: "/companies/plumbing" },
      { name: "Electrical Services", link: "/companies/electrical" },
      { name: "Landscaping", link: "/companies/landscaping" },
      { name: "Renovation Services", link: "/companies/renovation" },
      { name: "Flooring Installation", link: "/companies/flooring" },
      { name: "HVAC Services", link: "/companies/hvac" },
    ],
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Find your <span className="text-primary">Company</span> for <span className="text-primary">All Industries</span> you need
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industryCategories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-center mb-4">
                {category.icon}
                <h3 className="text-xl font-bold ml-2">{category.name}</h3>
              </div>
              <ul className="space-y-2">
                {category.services.slice(0, 8).map((service, index) => (
                  <li key={index}>
                    <Link href={`/companies?industry=${encodeURIComponent(service.name)}`} className="text-sm hover:text-primary">
                      {service.name}
                    </Link>
                  </li>
                ))}
                {category.services.length > 8 && (
                  <li className="pt-2">
                    <Link href={`/companies?industry=${encodeURIComponent(category.name)}`} className="text-sm text-primary font-medium hover:underline">
                      View All
                    </Link>
                  </li>
                )}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
