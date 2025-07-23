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
    // Get initial companies for SSR
    const companiesRef = firestore.collection('companies');
    let query = companiesRef
      .orderBy('infoScore', 'desc')  // 按信息完整度分数降序排列
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    
    // Apply filters if provided
    if (resolvedSearchParams.industry) {
      // 当有过滤条件时，需要重新构建查询
      query = companiesRef
        .where('industry', 'array-contains', resolvedSearchParams.industry)
        .orderBy('infoScore', 'desc')
        .limit(pageSize)
        .offset((page - 1) * pageSize);
    }
    if (resolvedSearchParams.state) {
      // 当有state过滤时，需要重新构建查询
      if (resolvedSearchParams.industry) {
        query = companiesRef
          .where('industry', 'array-contains', resolvedSearchParams.industry)
          .where('state', '==', resolvedSearchParams.state)
          .orderBy('infoScore', 'desc')
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      } else {
        query = companiesRef
          .where('state', '==', resolvedSearchParams.state)
          .orderBy('infoScore', 'desc')
          .limit(pageSize)
          .offset((page - 1) * pageSize);
      }
    }
    
    // Get total count for pagination (use base query without pagination)
    let countQuery = companiesRef;
    if (resolvedSearchParams.industry) {
      countQuery = countQuery.where('industry', 'array-contains', resolvedSearchParams.industry);
    }
    if (resolvedSearchParams.state) {
      countQuery = countQuery.where('state', '==', resolvedSearchParams.state);
    }
    const totalSnapshot = await countQuery.count().get();
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
    
    // 数据已经在数据库级别按infoScore排序，无需再次排序
    
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
