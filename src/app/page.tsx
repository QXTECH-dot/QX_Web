import { HeroSection } from "@/components/HeroSection";
import { NewCompaniesSection } from "@/components/NewCompaniesSection";
import { ServicesSection } from "@/components/ServicesSection";
import { BlogSection } from "@/components/BlogSection";
import { AboutSection } from "@/components/AboutSection";
import { AustralianMapSection } from "@/components/AustralianMapSection";
import { CompanyRankingSection } from "@/components/CompanyRankingSection";
import { StatisticsSection } from "@/components/StatisticsSection";
import { StatisticalMapSection } from "@/components/StatisticalMapSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Australian Business Directory & Company Search - ABN Lookup | QX Web",
  description: "Find Australian companies instantly with our comprehensive business directory. Search by ABN, company name, or industry. Access detailed business information, contact details, and company profiles. Australia's most trusted yellow pages alternative.",
  keywords: "Australian business directory, company search, ABN lookup, business information Australia, yellow pages, company details, business search engine, Australian companies database, business finder, company directory, ABN search, business listings Australia, commercial directory, professional services directory, business network Australia, company database, enterprise search, business intelligence Australia, corporate directory, trade directory Australia",
  alternates: {
    canonical: "https://qxweb.com.au/",
  },
  openGraph: {
    url: 'https://qxweb.com.au/',
    title: "Australian Business Directory & Company Search - ABN Lookup | QX Web",
    description: "Find Australian companies instantly with our comprehensive business directory. Search by ABN, company name, or industry. Access detailed business information and company profiles.",
    siteName: 'QX Web',
    images: [
      {
        url: 'https://qxweb.com.au/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QX Web - Australian Business Directory & Company Search',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatisticsSection />
      <ServicesSection />
      {typeof window !== 'undefined' && <NewCompaniesSection />}
      {/* 暂时移除行业排行榜区块 <CompanyRankingSection /> */}
      {/* <AustralianMapSection /> */}
      <StatisticalMapSection />
      <BlogSection />
      <AboutSection />
    </>
  );
}
