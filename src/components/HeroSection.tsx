"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SearchBar } from "@/components/search/SearchBar";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-background py-10 md:pt-16 md:pb-8">
      <div className="container">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Find your cooperation with <span className="text-qxnet">54,684</span>
            <br />Companies across Australia<span className="text-qxnet-600 text-xs align-top">143</span>
          </h1>

          {/* Search form with new SearchBar component */}
          <div className="w-full max-w-2xl">
            <SearchBar
              placeholder="Industries & Companies"
              fullWidth
              showLocationField
            />
            <div className="text-sm text-muted-foreground">
              Most popular searches this month:
              <Link href="/companies?industry=Finance" className="mx-1 hover:underline">Finance</Link> •
              <Link href="/companies?industry=Construction" className="mx-1 hover:underline">Construction</Link> •
              <Link href="/companies?industry=Accounting" className="mx-1 hover:underline">Accounting</Link> •
              <Link href="/companies?industry=Education" className="mx-1 hover:underline">Education</Link> •
              <Link href="/companies?industry=Healthcare" className="mx-1 hover:underline">Healthcare</Link>
            </div>
          </div>
        </div>

        {/* Trusted by section */}
        <div className="mt-12 mb-4">
          <p className="text-center text-sm font-semibold mb-4 uppercase">
            <span className="font-bold">Thousands</span> of Australian Businesses trust us
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <Image
              src="https://ext.same-assets.com/1651653002/2888447921.svg"
              alt="Commonwealth Bank"
              width={100}
              height={40}
            />
            <Image
              src="https://ext.same-assets.com/1651653002/2404146303.svg"
              alt="Woolworths"
              width={100}
              height={40}
            />
            <Image
              src="https://ext.same-assets.com/1651653002/2795328899.svg"
              alt="University of Sydney"
              width={140}
              height={40}
            />
            <Image
              src="https://ext.same-assets.com/1651653002/3114313562.svg"
              alt="Telstra"
              width={80}
              height={40}
            />
            <Image
              src="https://ext.same-assets.com/1651653002/409235749.svg"
              alt="NAB"
              width={100}
              height={40}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
