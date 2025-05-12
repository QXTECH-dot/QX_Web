import { BlogPost, BlogCategory, BlogTag } from '@/types/blog';

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  isFeatured?: boolean;
  excerpt?: string;
}

export const blogCategories: BlogCategory[] = [
  {
    id: 'technology',
    name: 'Technology',
    slug: 'technology',
    description: 'Insights into the Australian technology sector',
    image: '/storage/blog/categories/technology.jpg'
  },
  {
    id: 'construction',
    name: 'Construction',
    slug: 'construction',
    description: 'Analysis of the Australian construction industry',
    image: '/storage/blog/categories/construction.jpg'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    slug: 'healthcare',
    description: 'Updates on the Australian healthcare sector',
    image: '/storage/blog/categories/healthcare.jpg'
  },
  {
    id: 'education',
    name: 'Education',
    slug: 'education',
    description: 'Trends in the Australian education industry',
    image: '/storage/blog/categories/education.jpg'
  },
  {
    id: 'retail',
    name: 'Retail',
    slug: 'retail',
    description: 'Analysis of the Australian retail market',
    image: '/storage/blog/categories/retail.jpg'
  },
  {
    id: 'finance',
    name: 'Finance',
    slug: 'finance',
    description: 'Insights into the Australian financial sector',
    image: '/storage/blog/categories/finance.jpg'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    slug: 'manufacturing',
    description: 'Updates on the Australian manufacturing industry',
    image: '/storage/blog/categories/manufacturing.jpg'
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    slug: 'hospitality',
    description: 'Trends in the Australian hospitality sector',
    image: '/storage/blog/categories/hospitality.jpg'
  },
  {
    id: 'transport',
    name: 'Transport',
    slug: 'transport',
    description: 'Analysis of the Australian transport industry',
    image: '/storage/blog/categories/transport.jpg'
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    slug: 'agriculture',
    description: 'Insights into the Australian agricultural sector',
    image: '/storage/blog/categories/agriculture.jpg'
  }
];

export const blogTags: BlogTag[] = [
  { id: 'market-analysis', name: 'Market Analysis', slug: 'market-analysis' },
  { id: 'industry-trends', name: 'Industry Trends', slug: 'industry-trends' },
  { id: 'business-growth', name: 'Business Growth', slug: 'business-growth' },
  { id: 'regulatory-updates', name: 'Regulatory Updates', slug: 'regulatory-updates' },
  { id: 'technology', name: 'Technology', slug: 'technology' },
  { id: 'innovation', name: 'Innovation', slug: 'innovation' },
  { id: 'sustainability', name: 'Sustainability', slug: 'sustainability' },
  { id: 'workforce', name: 'Workforce', slug: 'workforce' },
  { id: 'investment', name: 'Investment', slug: 'investment' },
  { id: 'export', name: 'Export', slug: 'export' }
];

export const blogArticles: BlogPost[] = [
  {
    id: 'australian-tech-sector-2024',
    title: 'The Australian Technology Sector in 2024: Trends and Opportunities',
    slug: 'australian-tech-sector-2024',
    content: `The Australian technology sector has been experiencing unprecedented growth in recent years...`,
    excerpt: 'An in-depth analysis of the current state and future prospects of the Australian technology sector.',
    category: 'technology',
    tags: ['market-analysis', 'industry-trends', 'technology', 'innovation'],
    author: 'Alex Johnson',
    publishedAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    image: '/storage/blog/articles/tech-sector-2024.jpg',
    readTime: 8,
    status: 'published',
    metaTitle: 'Australian Technology Sector 2024: Key Trends & Growth Opportunities',
    metaDescription: 'Discover the latest trends, challenges, and opportunities in the Australian technology sector. Learn about key growth areas and investment potential.',
    views: 0
  },
  {
    id: 'construction-industry-outlook',
    title: 'Australian Construction Industry Outlook: 2024 Market Analysis',
    slug: 'construction-industry-outlook',
    content: `The Australian construction industry is facing both challenges and opportunities in 2024...`,
    excerpt: 'A comprehensive analysis of the current state and future prospects of the Australian construction industry.',
    category: 'construction',
    tags: ['market-analysis', 'industry-trends', 'sustainability', 'workforce'],
    author: 'Sarah Williams',
    publishedAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    image: '/storage/blog/articles/construction-outlook.jpg',
    readTime: 10,
    status: 'published',
    metaTitle: 'Australian Construction Industry 2024: Market Analysis & Trends',
    metaDescription: 'Explore the latest developments in the Australian construction industry, including market trends, challenges, and growth opportunities.',
    views: 0
  },
  {
    id: "why-are-tech-companies-moving-to-texas",
    title: "Why Are Tech Companies Moving To Texas?",
    slug: "why-are-tech-companies-moving-to-texas",
    content: "",
    excerpt: "",
    category: "market-research",
    tags: [],
    author: "",
    publishedAt: new Date("2025-03-26"),
    updatedAt: new Date("2025-03-26"),
    image: "https://ext.same-assets.com/3273624843/1546461295.webp",
    readTime: 10,
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0
  },
  {
    id: "blockchain-impacting-automotive-industry-poland",
    title: "How The Blockchain Is Impacting The Automotive Industry in Poland",
    slug: "blockchain-impacting-automotive-industry-poland",
    content: "",
    excerpt: "As we keep hearing more about blockchain over the years, the words 'revolutionary potential' and 'transforming everyday reality' keep arising around it. The blockchain indeed has the leverage to transform certain domains, and the automotive sector could be altered.",
    category: "market-research",
    tags: [],
    author: "",
    publishedAt: new Date("2025-03-24"),
    updatedAt: new Date("2025-03-24"),
    image: "https://ext.same-assets.com/3273624843/3057040859.png",
    readTime: 6,
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0
  },
  {
    id: "industries-affected-cyber-attacks",
    title: "Which Industries Face the Most Cyber Attacks?",
    slug: "industries-affected-cyber-attacks",
    content: "",
    excerpt: "",
    category: "market-research",
    tags: [],
    author: "",
    publishedAt: new Date("2025-03-11"),
    updatedAt: new Date("2025-03-11"),
    image: "https://ext.same-assets.com/3273624843/2821177495.webp",
    readTime: 12,
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0
  },
  {
    id: "ai-solutions-helping-businesses-grow-case-studies-instinctools",
    title: "How AI Solutions Are Helping Businesses Grow: 3 Case Studies",
    slug: "ai-solutions-helping-businesses-grow-case-studies-instinctools",
    content: "",
    excerpt: "",
    category: "market-research",
    tags: [],
    author: "",
    publishedAt: new Date("2025-03-10"),
    updatedAt: new Date("2025-03-10"),
    image: "https://ext.same-assets.com/3273624843/3127196007.webp",
    readTime: 9,
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0
  },
  {
    id: "moldova-next-outsourcing-destination",
    title: "Why is Moldova your Next IT Outsourcing Destination in 2025?",
    slug: "moldova-next-outsourcing-destination",
    content: "",
    excerpt: "",
    category: "market-research",
    tags: [],
    author: "",
    publishedAt: new Date("2025-03-05"),
    updatedAt: new Date("2025-03-05"),
    image: "https://ext.same-assets.com/3273624843/1936236758.webp",
    readTime: 7,
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0
  },
  {
    id: "where-to-find-web-development-agencies-ukraine",
    title: "Where to Find Web Development Agencies in Ukraine",
    slug: "where-to-find-web-development-agencies-ukraine",
    content: "",
    excerpt: "",
    category: "market-research",
    tags: [],
    author: "",
    publishedAt: new Date("2025-03-03"),
    updatedAt: new Date("2025-03-03"),
    image: "https://ext.same-assets.com/3273624843/1234567890.webp",
    readTime: 5,
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0
  },
  {
    id: "future-jobs-analysis-based-world-economic-forum",
    title: "Future Jobs: Analysis Based on World Economic Forum Report",
    slug: "future-jobs-analysis-based-world-economic-forum",
    content: "",
    excerpt: "",
    category: "market-research",
    tags: [],
    author: "",
    readTime: 14,
    image: "https://ext.same-assets.com/3273624843/1854154596.webp",
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0,
    publishedAt: new Date("2025-02-27"),
    updatedAt: new Date("2025-02-27")
  },
  {
    id: "ukrainian-cybersecurity-overview",
    title: "Ukrainian Cybersecurity Overview",
    slug: "ukrainian-cybersecurity-overview",
    content: "",
    excerpt: "",
    category: "market-research",
    tags: [],
    author: "",
    readTime: 9,
    image: "https://ext.same-assets.com/3273624843/3793332195.webp",
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0,
    publishedAt: new Date("2025-02-26"),
    updatedAt: new Date("2025-02-26")
  },
  {
    id: "average-price-software-development-ukraine",
    title: "Average Price for Software Development in Ukraine",
    slug: "average-price-software-development-ukraine",
    content: "",
    excerpt: "",
    category: "market-research",
    tags: [],
    author: "",
    readTime: 8,
    image: "https://ext.same-assets.com/3273624843/771584432.webp",
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0,
    publishedAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20")
  },
  {
    id: "how-low-code-and-no-code-accelerate-software-development-in-armenia",
    title: "How Low-Code and No-Code Accelerate Software Development in Armenia",
    slug: "how-low-code-and-no-code-accelerate-software-development-in-armenia",
    content: "",
    excerpt: "",
    category: "market-research",
    tags: [],
    author: "",
    readTime: 10,
    image: "https://ext.same-assets.com/3273624843/2350065608.webp",
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0,
    publishedAt: new Date("2025-01-06"),
    updatedAt: new Date("2025-01-06")
  },
  {
    id: "ireland-it-outsourcing-destination",
    title: "Ireland as an IT Outsourcing Destination",
    slug: "ireland-it-outsourcing-destination",
    content: "",
    excerpt: "",
    category: "market-research",
    tags: [],
    author: "",
    readTime: 11,
    image: "https://ext.same-assets.com/3273624843/2350065608.webp",
    status: "published",
    metaTitle: "",
    metaDescription: "",
    views: 0,
    publishedAt: new Date("2024-12-27"),
    updatedAt: new Date("2024-12-27")
  }
];
