"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { SearchParams } from "@/components/search/SearchUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const textProp = 'mx-1 text-base hover:underline'
  const router = useRouter();

  // Handle search submission
  const handleSearch = (params: SearchParams) => {
    // Build query parameters
    const urlParams = new URLSearchParams();
    if (params.query) urlParams.set('query', params.query);
    if (params.location) urlParams.set('location', params.location);
    if (params.abn) urlParams.set('abn', params.abn);
    if (params.industry) urlParams.set('industry', params.industry);
    if (params.services && params.services.length > 0) {
      params.services.forEach(service => urlParams.append('service', service));
    }
    if (params.industry_service) urlParams.set('industry_service', params.industry_service);
    
    // Navigate to companies page with search parameters
    const searchUrl = `/companies${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    router.push(searchUrl);
  };

  return (
    <section className="bg-background py-10 md:pt-16 md:pb-8">
      <div className="container">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Find your cooperation with <span className="text-qxnet">54,685</span>
            <br />Companies across Australia<span className="text-qxnet-600 text-xs align-top">143</span>
          </h1>
          
          {/* SEO-friendly subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
            Australia's most comprehensive business directory. Search companies by name, ABN, or industry. 
            Access detailed business information, contact details, and company profiles instantly.
          </p>

          {/* Advanced Search form */}
          <br/>
          <br/>
          <div className="w-full max-w-4xl">
            <AdvancedSearch 
              onSearch={handleSearch}
              initialParams={{}}
            />
            <br/>
            <br/>
            <div className="text-md text-muted-foreground">
              Most popular searches this month: <span/>
              <Link href="/companies?industry=Finance" className = {textProp}>Finance</Link> •
              <Link href="/companies?industry=Construction" className = {textProp}>Construction</Link> •
              <Link href="/companies?industry=Accounting" className = {textProp}>Accounting</Link> •
              <Link href="/companies?industry=Education" className = {textProp}>Education</Link> •
              <Link href="/companies?industry=Healthcare" className = {textProp}>Healthcare</Link>
            </div>
          </div>
        </div>

        {/* Trusted by section */}
        <div className="mt-12 mb-4">
          <p className="text-center text-md font-semibold mb-4 uppercase">
            <span className="font-bold">Thousands</span> of Australian Businesses trust us
          </p>
          <br/>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="w-[120px] h-[50px] bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="https://media.licdn.com/dms/image/v2/D4D0BAQEBHetFnaNJuQ/company-logo_200_200/company-logo_200_200/0/1727227196725/infinity_capital_mortgage_management_logo?e=2147483647&v=beta&t=mRyLnMYzpyJViIwwgxNjRYxtzI1IWO7PXwJ6KySWa-w"
                alt="Infinity Capital"
                width={150}
                height={50}
                className="object-cover"
              />
            </div>
            <div className="w-[120px] h-[50px] bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="https://vateefx.com/wp-content/uploads/2022/07/%E5%8E%9F%E6%9C%89%E8%B5%84%E6%BA%90-8.png"
                alt="Vateefx"
                width={100}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="w-[120px] h-[50px] bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="https://livecomfy.com.au/wp-content/uploads/2020/01/Live_Comfy_Landscape_Logo.png"
                alt="LiveComfy"
                width={100}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="w-[120px] h-[50px] bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsokQ6Q52JP5TdXBQhJEOntYoQNYXeksMYQ&s"
                alt="VIP Mortgage"
                width={80}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
