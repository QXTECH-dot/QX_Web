import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://qxweb.com.au'
  const now = new Date()
  
  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/industries`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/industry-data-visualization`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/companies/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/state-comparison`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/get-listed`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/company-verify`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Australian states/territories
  const statePages: MetadataRoute.Sitemap = [
    'australian-capital-territory',
    'new-south-wales',
    'northern-territory', 
    'queensland',
    'south-australia',
    'tasmania',
    'victoria',
    'western-australia'
  ].map(stateId => ({
    url: `${baseUrl}/state/${stateId}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Companies by state
  const companiesByStatePages: MetadataRoute.Sitemap = [
    'australian-capital-territory',
    'new-south-wales', 
    'northern-territory',
    'queensland',
    'south-australia',
    'tasmania',
    'victoria',
    'western-australia'
  ].map(state => ({
    url: `${baseUrl}/companies/${state}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Blog categories and articles - fetch from Firebase database
  let blogCategoryPages: MetadataRoute.Sitemap = []
  let blogArticlePages: MetadataRoute.Sitemap = []
  
  try {
    const admin = await import('firebase-admin')
    
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    }
    
    const db = admin.firestore()
    
    // Get blog articles from database (using 'blogs' collection)
    const blogsSnapshot = await db.collection('blogs').get()
    blogArticlePages = blogsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        url: `${baseUrl}/blog/${data.slug || doc.id}`,
        lastModified: data.publishedAt && typeof data.publishedAt.toDate === 'function' 
          ? data.publishedAt.toDate() 
          : data.publishedAt 
          ? new Date(data.publishedAt) 
          : data.createdAt && typeof data.createdAt.toDate === 'function'
          ? data.createdAt.toDate()
          : data.createdAt
          ? new Date(data.createdAt)
          : now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }
    })
    
    // Blog categories - extract unique categories from blog articles
    const categories = new Set()
    blogsSnapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.category) {
        categories.add(data.category)
      }
    })
    
    blogCategoryPages = Array.from(categories).map(category => ({
      url: `${baseUrl}/blog/category/${String(category).toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
    
    console.log(`Sitemap: Generated ${blogCategoryPages.length} blog category URLs and ${blogArticlePages.length} blog article URLs from Firebase`)
  } catch (error) {
    console.error('Error fetching blog data for sitemap:', error)
    console.error('Firebase environment variables check:', {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    })
    // Empty arrays if database fetch fails - no fallback to local data
    blogCategoryPages = []
    blogArticlePages = []
  }

  // Company pages - use Firebase Admin SDK for server-side generation
  let companyPages: MetadataRoute.Sitemap = []
  
  try {
    // Use Admin SDK for server-side data fetching
    const admin = await import('firebase-admin')
    
    // Use existing app or get default app
    const app = admin.apps.length > 0 ? admin.app() : admin.apps[0]
    const db = app ? app.firestore() : admin.firestore()
    const companiesSnapshot = await db.collection('companies').get()
    
    const companies = companiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    companyPages = companies
      .filter(company => company.id)
      .map(company => ({
        url: `${baseUrl}/company/${company.slug || company.id}`,
        lastModified: company.updatedAt && typeof company.updatedAt.toDate === 'function' 
          ? company.updatedAt.toDate() 
          : company.updatedAt 
          ? new Date(company.updatedAt) 
          : now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    
    console.log(`Sitemap: Generated ${companyPages.length} company URLs from Firebase Admin`)
  } catch (error) {
    console.error('Error fetching companies for sitemap:', error)
    console.error('Companies fetch error details:', {
      message: error.message,
      hasFirebaseApp: admin.apps.length > 0,
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    })
    // No fallback to local data - keep empty if database fails
    companyPages = []
    console.log(`Sitemap: No company URLs due to database error`)
  }

  // Events not available yet - skip event pages
  const eventPages: MetadataRoute.Sitemap = []

  // Combine all pages and sort by priority and last modified
  const allPages = [
    ...staticPages,
    ...statePages,
    ...companiesByStatePages,
    ...blogCategoryPages,
    ...blogArticlePages,
    ...companyPages,
    ...eventPages,
  ]

  // Sort by priority (descending) then by lastModified (descending)
  return allPages
    .sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority
      }
      return new Date(b.lastModified!).getTime() - new Date(a.lastModified!).getTime()
    })
    .slice(0, 50000)
} 