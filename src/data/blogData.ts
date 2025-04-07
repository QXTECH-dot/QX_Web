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

export const blogCategories = [
  { id: "all", name: "All Articles", count: 709 },
  { id: "finance", name: "Finance", count: 156 },
  { id: "construction", name: "Construction", count: 124 },
  { id: "it", name: "IT", count: 374 },
  { id: "health", name: "Health", count: 80 },
  { id: "others", name: "Others", count: 75 },
];

export const blogArticles: BlogArticle[] = [
  {
    id: "qxnet-2024-awards-quick-recap",
    title: "A Quick Recap: QX Net 2024 Awards",
    slug: "qxnet-2024-awards-quick-recap",
    category: "market-research",
    date: "2025-02-10",
    readTime: "8 min read",
    image: "https://ext.same-assets.com/3273624843/2162209631.webp",
    isFeatured: true,
    excerpt: "For the fourth consecutive year, QX Net supports and recognizes excellence in information and technology in the global B2B market. In 2024, 3905 nominated companies from around..."
  },
  {
    id: "why-are-tech-companies-moving-to-texas",
    title: "Why Are Tech Companies Moving To Texas?",
    slug: "why-are-tech-companies-moving-to-texas",
    category: "market-research",
    date: "2025-03-26",
    readTime: "10 min read",
    image: "https://ext.same-assets.com/3273624843/1546461295.webp"
  },
  {
    id: "blockchain-impacting-automotive-industry-poland",
    title: "How The Blockchain Is Impacting The Automotive Industry in Poland",
    slug: "blockchain-impacting-automotive-industry-poland",
    category: "market-research",
    date: "2025-03-24",
    readTime: "6 min read",
    image: "https://ext.same-assets.com/3273624843/3057040859.png",
    excerpt: "As we keep hearing more about blockchain over the years, the words 'revolutionary potential' and 'transforming everyday reality' keep arising around it. The blockchain indeed has the leverage to transform certain domains, and the automotive sector could be altered."
  },
  {
    id: "industries-affected-cyber-attacks",
    title: "Which Industries Face the Most Cyber Attacks?",
    slug: "industries-affected-cyber-attacks",
    category: "market-research",
    date: "2025-03-11",
    readTime: "12 min read",
    image: "https://ext.same-assets.com/3273624843/2821177495.webp"
  },
  {
    id: "ai-solutions-helping-businesses-grow-case-studies-instinctools",
    title: "How AI Solutions Are Helping Businesses Grow: 3 Case Studies",
    slug: "ai-solutions-helping-businesses-grow-case-studies-instinctools",
    category: "market-research",
    date: "2025-03-10",
    readTime: "9 min read",
    image: "https://ext.same-assets.com/3273624843/3127196007.webp"
  },
  {
    id: "moldova-next-outsourcing-destination",
    title: "Why is Moldova your Next IT Outsourcing Destination in 2025?",
    slug: "moldova-next-outsourcing-destination",
    category: "market-research",
    date: "2025-03-05",
    readTime: "7 min read",
    image: "https://ext.same-assets.com/3273624843/1936236758.webp"
  },
  {
    id: "where-to-find-web-development-agencies-ukraine",
    title: "Where to Find Web Development Agencies in Ukraine",
    slug: "where-to-find-web-development-agencies-ukraine",
    category: "market-research",
    date: "2025-03-03",
    readTime: "11 min read",
    image: "https://ext.same-assets.com/3273624843/911012039.webp"
  },
  {
    id: "future-jobs-analysis-based-world-economic-forum",
    title: "The Future of IT Jobs For 2025-2030, Analysis Based on World Economic Forum",
    slug: "future-jobs-analysis-based-world-economic-forum",
    category: "market-research",
    date: "2025-02-27",
    readTime: "14 min read",
    image: "https://ext.same-assets.com/3273624843/1854154596.webp"
  },
  {
    id: "ukrainian-cybersecurity-overview",
    title: "An Overview of Ukrainian Cybersecurity",
    slug: "ukrainian-cybersecurity-overview",
    category: "market-research",
    date: "2025-02-26",
    readTime: "9 min read",
    image: "https://ext.same-assets.com/3273624843/3793332195.webp"
  },
  {
    id: "average-price-software-development-ukraine",
    title: "What Is the Average Price of Software Development in Ukraine?",
    slug: "average-price-software-development-ukraine",
    category: "market-research",
    date: "2025-01-20",
    readTime: "8 min read",
    image: "https://ext.same-assets.com/3273624843/771584432.webp"
  },
  {
    id: "how-low-code-and-no-code-accelerate-software-development-in-armenia",
    title: "How Low-Code and No-Code Accelerate Software Development in Armenia",
    slug: "how-low-code-and-no-code-accelerate-software-development-in-armenia",
    category: "market-research",
    date: "2025-01-06",
    readTime: "10 min read",
    image: "https://ext.same-assets.com/3273624843/2350065608.webp"
  },
  {
    id: "ireland-it-outsourcing-destination",
    title: "Is Ireland a Good It Outsourcing Destination?",
    slug: "ireland-it-outsourcing-destination",
    category: "market-research",
    date: "2024-12-27",
    readTime: "11 min read",
    image: "https://ext.same-assets.com/3273624843/2350065608.webp"
  }
];
