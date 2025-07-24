import { Metadata } from "next";
import { CompaniesPageWrapper } from "@/components/companies/CompaniesPageWrapper";
import { firestore } from '@/lib/firebase/admin';

// Force revalidation to ensure fresh data
export const revalidate = 0;

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
    // Simplified query to avoid composite index - get all companies
    const snapshot = await firestore.collection('companies').get();
    let allCompanies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Apply filters in memory
    if (resolvedSearchParams.industry) {
      allCompanies = allCompanies.filter(company => {
        const companyIndustries = Array.isArray(company.industry) ? company.industry : [company.industry];
        return companyIndustries.includes(resolvedSearchParams.industry);
      });
    }
    
    if (resolvedSearchParams.state) {
      allCompanies = allCompanies.filter(company => company.state === resolvedSearchParams.state);
    }
    
    // Sort by info score
    allCompanies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
    
    // Calculate pagination
    totalCount = allCompanies.length;
    totalPages = Math.ceil(totalCount / pageSize);
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCompanies = allCompanies.slice(startIndex, endIndex);
    
    // Serialize the companies to remove Firestore Timestamp objects
    initialCompanies = JSON.parse(JSON.stringify(paginatedCompanies));
    
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

// Calculate company info score (logo gets high priority)
function getCompanyInfoScore(company: any): number {
  let score = 0;
  
  // Logo gets a very high base score to ensure companies with logos rank first
  if (company.logo) {
    score += 100; // High base score for having a logo
  }
  
  // Other factors add smaller incremental scores
  if (company.description || company.shortDescription || company.fullDescription) score += 10;
  if (company.services && company.services.length > 0) score += Math.min(company.services.length * 3, 15); // Max 15 for services
  if (company.languages && company.languages.length > 0) score += 5;
  if (company.offices && company.offices.length > 0) score += 5;
  if (company.website) score += 10;
  if (company.abn) score += 5;
  if (company.industry && company.industry.length > 0) score += 5;
  if (company.verified) score += 10;
  
  return score;
}
