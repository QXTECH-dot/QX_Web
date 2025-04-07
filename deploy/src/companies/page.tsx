import { Metadata } from "next";
import { CompaniesPage } from "@/components/companies/CompaniesPage";

export const metadata: Metadata = {
  title: "Find IT Companies For Your Projects - TechBehemoths Clone",
  description: "Browse through thousands of top IT companies across 144 countries. Find the perfect agency for web development, design, SEO, and more.",
};

export default function CompaniesRoute() {
  return <CompaniesPage />;
}
