import { CompanyProfile } from "@/components/companies/CompanyProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Profile - QX Web",
  description: "View details, services, portfolio and reviews of this IT company.",
};

// This function is needed for static exports with dynamic routes
export function generateStaticParams() {
  // Pre-render pages for these IDs
  return [
    { id: 'bytset-solutions' },
    { id: 'customerlabs' },
    { id: 'incrementors-web-solutions' }, // Added the new company
    { id: 'bitra-digital-media' },
    { id: 'website-seo' }
  ];
}

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  return <CompanyProfile id={params.id} />;
}
