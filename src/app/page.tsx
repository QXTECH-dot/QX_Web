import { HeroSection } from "@/components/HeroSection";
import { NewCompaniesSection } from "@/components/NewCompaniesSection";
import { ServicesSection } from "@/components/ServicesSection";
import { BlogSection } from "@/components/BlogSection";
import { AboutSection } from "@/components/AboutSection";
import { AustralianMapSection } from "@/components/AustralianMapSection";
import { CompanyRankingSection } from "@/components/CompanyRankingSection";
import { StatisticsSection } from "@/components/StatisticsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatisticsSection />
      <ServicesSection />
      {typeof window !== 'undefined' && <NewCompaniesSection />}
      {/* 暂时移除行业排行榜区块 <CompanyRankingSection /> */}
      <AustralianMapSection />
      <BlogSection />
      <AboutSection />
    </>
  );
}
