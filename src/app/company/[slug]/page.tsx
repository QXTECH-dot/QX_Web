import { CompanyProfile } from "@/components/companies/CompanyProfile";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Company Profile - QX Net",
  description: "View details, services, company history, portfolio and reviews of this company on QX Net.",
};

// This function is needed for static exports with dynamic routes
export function generateStaticParams() {
  // Pre-render pages for these slugs
  return [
    { slug: 'bytset-solutions' },
    { slug: 'customerlabs' },
    { slug: 'incrementors-web-solutions' },
    { slug: 'bitra-digital-media' },
    { slug: 'website-seo' },
    { slug: 'geocon' },
    { slug: 'doma-group' },
    { slug: 'hi-home' }
  ];
}

export default function CompanyProfilePage({ params }: { params: { slug: string } }) {
  return (
    <div className="w-full px-4 sm:px-6 lg:max-w-[calc(100%-250px)] lg:mx-auto lg:px-0">
      <Suspense fallback={<div>Loading...</div>}>
        <CompanyProfile id={params.slug} />
      </Suspense>
    </div>
  );
}
