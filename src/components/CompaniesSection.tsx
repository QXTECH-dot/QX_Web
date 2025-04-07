"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AustralianMap } from "./AustralianMap";

const regions = [
  { id: "europe", name: "Europe" },
  { id: "asia", name: "Asia" },
  { id: "northAmerica", name: "North America" },
  { id: "southAmerica", name: "South America" },
  { id: "australia", name: "Australia & Oceania" },
  { id: "africa", name: "Africa" },
];

const countryData = {
  europe: [
    { name: "United Kingdom", link: "/companies/united-kingdom" },
    { name: "Ukraine", link: "/companies/ukraine" },
    { name: "Germany", link: "/companies/germany" },
    { name: "Spain", link: "/companies/spain" },
    { name: "Poland", link: "/companies/poland" },
    { name: "Italy", link: "/companies/italy" },
    { name: "Romania", link: "/companies/romania" },
    { name: "Ireland", link: "/companies/ireland" },
    { name: "France", link: "/companies/france" },
    { name: "Netherlands", link: "/companies/netherlands" },
  ],
  asia: [
    { name: "India", link: "/companies/india" },
    { name: "Pakistan", link: "/companies/pakistan" },
    { name: "Bangladesh", link: "/companies/bangladesh" },
    { name: "Singapore", link: "/companies/singapore" },
    { name: "Philippines", link: "/companies/philippines" },
  ],
  northAmerica: [
    { name: "United States", link: "/companies/united-states" },
    { name: "Canada", link: "/companies/canada" },
    { name: "Mexico", link: "/companies/mexico" },
    { name: "Costa Rica", link: "/companies/costa-rica" },
    { name: "Panama", link: "/companies/panama" },
  ],
  southAmerica: [
    { name: "Brazil", link: "/companies/brazil" },
    { name: "Colombia", link: "/companies/colombia" },
    { name: "Argentina", link: "/companies/argentina" },
    { name: "Chile", link: "/companies/chile" },
    { name: "Uruguay", link: "/companies/uruguay" },
  ],
  australia: [
    { name: "Australia", link: "/companies/australia" },
    { name: "New Zealand", link: "/companies/new-zealand" },
  ],
  africa: [
    { name: "South Africa", link: "/companies/south-africa" },
    { name: "Nigeria", link: "/companies/nigeria" },
    { name: "Kenya", link: "/companies/kenya" },
    { name: "Egypt", link: "/companies/egypt" },
    { name: "Morocco", link: "/companies/morocco" },
  ],
};

export function CompaniesSection() {
  const [activeRegion, setActiveRegion] = useState("europe");

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Handpicked Companies Around the World
        </h2>

        {/* Tabs for regions */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {regions.map((region) => (
            <Button
              key={region.id}
              variant={activeRegion === region.id ? "default" : "outline"}
              className={activeRegion === region.id ? "bg-primary text-white" : ""}
              onClick={() => setActiveRegion(region.id)}
            >
              {region.name}
            </Button>
          ))}
        </div>

        {/* Map visualization */}
        <div className="mb-10 relative overflow-hidden h-[300px] md:h-[400px] bg-gray-100 rounded-lg">
          {activeRegion === "australia" ? (
            <div className="absolute inset-0 p-4">
              <AustralianMap />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Image
                src="https://ext.same-assets.com/1651653002/3742484979.webp"
                alt="World map with IT companies"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
        </div>

        {/* Countries list */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {countryData[activeRegion as keyof typeof countryData].map((country, index) => (
            <Card key={index} className="flex items-center p-3 hover:shadow-md transition-shadow">
              <Link href={country.link} className="flex items-center w-full">
                <span className="flex-grow text-sm">{country.name}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/countries">
            <Button variant="outline" className="mr-2">
              See all 144 Countries
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
