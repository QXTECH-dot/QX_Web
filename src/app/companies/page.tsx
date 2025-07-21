import { Metadata } from "next";
import { CompaniesPageWrapper } from "@/components/companies/CompaniesPageWrapper";
import { firestore } from '@/lib/firebase/admin';

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

interface SearchParams {
  industry?: string;
  state?: string;
  location?: string;
  query?: string;
  search?: string;
  abn?: string;
  page?: string;
}

// Server component - renders initial data for SEO
export default async function CompaniesRoute({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const pageSize = 12;
  
  let initialCompanies = [];
  let totalCount = 0;
  let totalPages = 1;
  
  try {
    // Get initial companies for SSR
    const companiesRef = firestore.collection('companies');
    let query = companiesRef.limit(pageSize).offset((page - 1) * pageSize);
    
    // Apply filters if provided
    if (resolvedSearchParams.industry) {
      query = query.where('industry', 'array-contains', resolvedSearchParams.industry);
    }
    if (resolvedSearchParams.state) {
      query = query.where('state', '==', resolvedSearchParams.state);
    }
    
    // Get total count for pagination
    const totalSnapshot = await companiesRef.count().get();
    totalCount = totalSnapshot.data().count;
    totalPages = Math.ceil(totalCount / pageSize);
    
    // Get companies
    const snapshot = await query.get();
    const rawCompanies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Serialize the companies to remove Firestore Timestamp objects
    initialCompanies = JSON.parse(JSON.stringify(rawCompanies));
    
    // Calculate company info scores and sort
    initialCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
    
  } catch (error) {
    console.error('Error fetching initial companies:', error);
    // Fallback to empty data if error occurs
  }

  return (
    <CompaniesPageWrapper 
      initialCompanies={initialCompanies}
      initialTotalCount={totalCount}
      initialTotalPages={totalPages}
      initialPage={page}
      searchParams={resolvedSearchParams}
    />
  );
}

// Calculate company info score (same as frontend logic)
function getCompanyInfoScore(company: any): number {
  let score = 0;
  if (company.logo) score += 1;
  if (company.description || company.shortDescription || company.fullDescription) score += 1;
  if (company.services && company.services.length > 0) score += Math.min(company.services.length, 3);
  if (company.languages && company.languages.length > 0) score += 1;
  if (company.offices && company.offices.length > 0) score += 1;
  if (company.website) score += 1;
  if (company.abn) score += 1;
  if (company.industry && company.industry.length > 0) score += 1;
  if (company.verified) score += 1;
  return score;
}
