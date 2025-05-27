import { Metadata } from "next";
import { CompaniesPage } from "@/components/companies/CompaniesPage";

export const metadata: Metadata = {
  title: "Company Search & Business Directory - Find Australian Companies | QX Web",
  description: "Search thousands of Australian companies and businesses. Find detailed company information, ABN details, contact information, and business profiles. Your comprehensive business directory for Australia.",
  keywords: "company search, Australian companies, business directory, company information, ABN lookup, business details, company profiles, business search, corporate directory, enterprise search, company database Australia, business listings, commercial directory, professional services directory, business network Australia",
  alternates: {
    canonical: "https://qxweb.com.au/companies",
  },
  openGraph: {
    title: "Company Search & Business Directory - Find Australian Companies | QX Web",
    description: "Search thousands of Australian companies and businesses. Find detailed company information, ABN details, and business profiles.",
    url: "https://qxweb.com.au/companies",
    siteName: "QX Web",
    images: [
      {
        url: 'https://qxweb.com.au/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QX Web - Company Search & Business Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function CompaniesRoute() {
  return <CompaniesPage />;
}
