"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

// Sample data for newcomer companies
const newcomerCompanies = [
  {
    id: "bytset-solutions",
    name: "Bytset Solutions | Logo Design Company",
    location: "Kerala, India",
    description: "Bytset Branding Solutions is the best logo design company Kerala, India and worldwide, specializing in creative and professional logo designs.",
    logo: "https://ext.same-assets.com/3273624843/3218314263.png",
    verified: true,
  },
  {
    id: "customerlabs",
    name: "CustomerLabs",
    location: "Chennai, India",
    description: "CustomerLabs helps businesses collect, unify, and activate first-party data for better marketing, personalization, and privacy-compliant advertising.",
    logo: "https://ext.same-assets.com/3273624843/1192082462.png",
    verified: true,
  },
  {
    id: "bitra-digital-media",
    name: "Bitra Digital Media",
    location: "Hyderabad, India",
    description: "Bitra digital media, best seo services in hyderabad, top seo companies in hyderabad",
    logo: "https://ext.same-assets.com/3273624843/2626877702.jpeg",
    verified: true,
  },
  {
    id: "website-seo",
    name: "Website SEO",
    location: "Ottawa, Canada",
    description: "We leverage cutting-edge SEO strategies alongside powerful AI technologies to maximize your online presence. Experts in Ottawa SEO",
    logo: "https://ext.same-assets.com/0/2073540251.svg",
    verified: true,
  },
];

export function NewCompaniesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Today's Newcomers on QX Net
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          Latest companies that joined QX Net
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newcomerCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden flex flex-col h-full">
              <div className="p-6 flex-grow">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 mr-3 flex items-center justify-center">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">
                      {company.name}
                      {company.verified && (
                        <span className="ml-1 text-xs text-primary">✓</span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">{company.location}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {company.description}
                </p>
              </div>
              <div className="p-4 border-t flex justify-between">
                <Link href={`/company/${company.id}`}>
                  <Button variant="outline" size="sm">
                    View profile
                  </Button>
                </Link>
                <Button variant="link" size="sm" className="text-primary">
                  Get In Touch
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/companies">
            <Button variant="outline">
              View All Companies
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
