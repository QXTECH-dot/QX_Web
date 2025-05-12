import { CompanyProfile } from "@/components/companies/CompanyProfile";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Company Profile - QX Net",
  description: "View details, services, company history, portfolio and reviews of this company on QX Net.",
};

// This function is needed for static exports with dynamic routes
export function generateStaticParams() {
  // Pre-render pages for these IDs
  return [
    { id: 'bytset-solutions' },
    { id: 'customerlabs' },
    { id: 'incrementors-web-solutions' },
    { id: 'bitra-digital-media' },
    { id: 'website-seo' },
    { id: 'OuAmCTjcgKAAbcmG6UWl' }
  ];
}

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  return (
    <div style={{ maxWidth: 'calc(100% - 250px)', margin: '0 auto' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <CompanyProfile id={params.id} />
      </Suspense>
    </div>
  );
}
