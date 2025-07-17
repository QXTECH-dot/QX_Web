import { MetadataRoute } from 'next'
import { companiesData } from '@/data/companiesData'
import { blogCategories, blogArticles } from '@/data/blogData'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: `${baseUrl}/events`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
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

  // Blog categories
  const blogCategoryPages: MetadataRoute.Sitemap = blogCategories.map(category => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Blog articles
  const blogArticlePages: MetadataRoute.Sitemap = blogArticles.map(article => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Company pages
  const companyPages: MetadataRoute.Sitemap = companiesData.map(company => ({
    url: `${baseUrl}/company/${company.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Event pages (static IDs from the build output)
  const eventPages: MetadataRoute.Sitemap = [
    '1090314884169',
    '1235283890369', 
    '1312380498399',
    '1235283890370',
    '1235283890371',
    '1235283890372',
    '1235283890373',
    '1235283890374'
  ].map(eventId => ({
    url: `${baseUrl}/events/${eventId}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...statePages,
    ...companiesByStatePages,
    ...blogCategoryPages,
    ...blogArticlePages,
    ...companyPages,
    ...eventPages,
  ]
} 