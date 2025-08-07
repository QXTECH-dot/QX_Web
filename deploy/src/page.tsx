import { HeroSection } from "@/components/HeroSection";
import { CompaniesSection } from "@/components/CompaniesSection";
import { ServicesSection } from "@/components/ServicesSection";
import { NewCompaniesSection } from "@/components/NewCompaniesSection";
import { BlogSection } from "@/components/BlogSection";
import { AboutSection } from "@/components/AboutSection";
import { AustralianMapSection } from "@/components/AustralianMapSection";
import { CompanyRankingSection } from "@/components/CompanyRankingSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AustralianMapSection />
      <CompaniesSection />
      <ServicesSection />
      <NewCompaniesSection />
      <CompanyRankingSection />
      <BlogSection />
      <AboutSection />
    </>
  );
}
