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
    id: "design",
    name: "Design",
    icon: <PenTool className="h-6 w-6 text-primary" />,
    services: [
      { name: "Graphic Design", link: "/companies/graphic-design" },
      { name: "Interior Design", link: "/companies/interior-design" },
      { name: "UI/UX Design", link: "/companies/ui-ux-design" },
      { name: "Product Design", link: "/companies/product-design" },
      { name: "Logo Design", link: "/companies/logo-design" },
      { name: "Brand Identity", link: "/companies/brand-identity" },
      { name: "Packaging Design", link: "/companies/packaging-design" },
      { name: "Web Design", link: "/companies/web-design" },
      { name: "Print Design", link: "/companies/print-design" },
      { name: "Industrial Design", link: "/companies/industrial-design" },
      { name: "Fashion Design", link: "/companies/fashion-design" },
      { name: "Architectural Design", link: "/companies/architectural-design" },
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
          Find your <span className="text-primary">Company</span> for <span className="text-primary">General Industries</span> you need
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
          Below is a detailed breakdown of the 4+ main Categories and 510+ Services throughout 54684 companies listed on TechBehemoths
        </p>

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
                    <Link href={service.link} className="text-sm hover:text-primary">
                      {service.name}
                    </Link>
                  </li>
                ))}
                {category.services.length > 8 && (
                  <li className="pt-2">
                    <Link href={`/companies/${category.id}`} className="text-sm text-primary font-medium hover:underline">
                      View All
                    </Link>
                  </li>
                )}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services">
            <Button variant="outline" size="lg">
              Browse all 510+ Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
