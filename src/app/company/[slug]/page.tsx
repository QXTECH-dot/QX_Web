import { Metadata } from "next";
import { notFound } from "next/navigation";
import { firestore } from '@/lib/firebase/admin';
import { CompanyProfileWrapper } from "@/components/companies/CompanyProfileWrapper";
import { Company } from '@/types/company';

interface Props {
  params: Promise<{ slug: string }>;
}

// Server component - fetches company data for SEO
export default async function CompanyProfilePage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let company: Company | null = null;

  try {
    const companiesRef = firestore.collection('companies');
    
    // First try to find by slug
    let querySnapshot = await companiesRef.where('slug', '==', slug).limit(1).get();
    
    // If not found by slug, try to find by ID
    if (querySnapshot.empty) {
      const docRef = await companiesRef.doc(slug).get();
      if (docRef.exists) {
        company = {
          id: docRef.id,
          ...docRef.data(),
        } as Company;
      }
    } else {
      const doc = querySnapshot.docs[0];
      company = {
        id: doc.id,
        ...doc.data(),
      } as Company;
    }

    if (!company) {
      notFound();
    }

    // Serialize the company data to remove Firestore Timestamp objects
    const serializedCompany = JSON.parse(JSON.stringify(company)) as Company;

    return (
      <CompanyProfileWrapper 
        company={serializedCompany}
        slug={slug}
      />
    );

  } catch (error) {
    console.error('Error fetching company:', error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const companiesRef = firestore.collection('companies');
    
    // First try to find by slug
    let querySnapshot = await companiesRef.where('slug', '==', slug).limit(1).get();
    
    // If not found by slug, try to find by ID
    if (querySnapshot.empty) {
      const docRef = await companiesRef.doc(slug).get();
      if (docRef.exists) {
        const data = docRef.data();
        const company = {
          id: docRef.id,
          ...data,
        };
        
        const companyName = company.name_en || company.name || 'Company';
        const description = company.fullDescription || company.shortDescription || company.description || 
          `${companyName} - Find detailed company information, services, and contact details on QX Web.`;

        return {
          title: `${companyName} - QX Web`,
          description: description.substring(0, 160),
          keywords: `${companyName}, company information, business details, Australian companies, ${company.industry || ''}`,
          alternates: {
            canonical: `https://qxweb.com.au/company/${slug}`,
          },
          openGraph: {
            title: `${companyName} - QX Web`,
            description: description.substring(0, 160),
            url: `https://qxweb.com.au/company/${slug}`,
            siteName: "QX Web",
            images: company.logo ? [
              {
                url: company.logo,
                width: 1200,
                height: 630,
                alt: `${companyName} Logo`,
              }
            ] : [
              {
                url: 'https://qxweb.com.au/og-image.png',
                width: 1200,
                height: 630,
                alt: 'QX Web - Company Profile',
              }
            ],
          },
          twitter: {
            card: 'summary_large_image',
          },
        };
      }
    } else {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      const company = {
        id: doc.id,
        ...data,
      };
      
      const companyName = company.name_en || company.name || 'Company';
      const description = company.fullDescription || company.shortDescription || company.description || 
        `${companyName} - Find detailed company information, services, and contact details on QX Web.`;

      return {
        title: `${companyName} - QX Web`,
        description: description.substring(0, 160),
        keywords: `${companyName}, company information, business details, Australian companies, ${company.industry || ''}`,
        alternates: {
          canonical: `https://qxweb.com.au/company/${slug}`,
        },
        openGraph: {
          title: `${companyName} - QX Web`,
          description: description.substring(0, 160),
          url: `https://qxweb.com.au/company/${slug}`,
          siteName: "QX Web",
          images: company.logo ? [
            {
              url: company.logo,
              width: 1200,
              height: 630,
              alt: `${companyName} Logo`,
            }
          ] : [
            {
              url: 'https://qxweb.com.au/og-image.png',
              width: 1200,
              height: 630,
              alt: 'QX Web - Company Profile',
            }
          ],
        },
        twitter: {
          card: 'summary_large_image',
        },
      };
    }

  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'Company Information - QX Web',
    description: 'View detailed company information, services, history, and contact details.',
    alternates: {
      canonical: `https://qxweb.com.au/company/${slug}`,
    },
  };
}

// Generate static params for build optimization
export async function generateStaticParams() {
  try {
    const companiesRef = firestore.collection('companies');
    const snapshot = await companiesRef.limit(100).get(); // Limit for build performance
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        slug: data.slug || doc.id, // Use slug if available, otherwise use ID
      };
    });
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}