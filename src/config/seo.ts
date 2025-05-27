import { DefaultSeoProps } from 'next-seo';

export const defaultSEO: DefaultSeoProps = {
  title: "QX Web - Australia's Premier Business Directory & Company Search",
  titleTemplate: "%s | QX Web - Australian Business Directory",
  description: "Australia's leading business directory and company search platform. Find ABN lookup, company information, business details, and connect with service providers across all industries. Your trusted yellow pages alternative.",
  canonical: "https://qxweb.com.au",
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://qxweb.com.au',
    siteName: 'QX Web',
    title: "QX Web - Australia's Premier Business Directory & Company Search",
    description: "Australia's leading business directory and company search platform. Find ABN lookup, company information, business details, and connect with service providers across all industries.",
    images: [
      {
        url: 'https://qxweb.com.au/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QX Web - Australian Business Directory',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    handle: '@qxweb',
    site: '@qxweb',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'Australian business directory, company search Australia, ABN lookup, business information, yellow pages Australia, company details, business search, Australian companies, business directory, company finder, ABN search, business listings, commercial directory, trade directory, professional services, business network, company database, enterprise search, business intelligence, corporate directory'
    },
    {
      name: 'author',
      content: 'QX Web'
    },
    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    },
    {
      name: 'googlebot',
      content: 'index, follow'
    },
    {
      name: 'bingbot',
      content: 'index, follow'
    },
    {
      name: 'geo.region',
      content: 'AU'
    },
    {
      name: 'geo.country',
      content: 'Australia'
    },
    {
      name: 'language',
      content: 'English'
    },
    {
      name: 'distribution',
      content: 'global'
    },
    {
      name: 'rating',
      content: 'general'
    },
    {
      name: 'revisit-after',
      content: '1 day'
    }
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180'
    },
    {
      rel: 'manifest',
      href: '/manifest.json'
    }
  ],
};

export const homePageSEO = {
  title: "Australian Business Directory & Company Search - ABN Lookup | QX Web",
  description: "Find Australian companies instantly with our comprehensive business directory. Search by ABN, company name, or industry. Access detailed business information, contact details, and company profiles. Australia's most trusted yellow pages alternative.",
  canonical: "https://qxweb.com.au",
  openGraph: {
    title: "Australian Business Directory & Company Search - ABN Lookup | QX Web",
    description: "Find Australian companies instantly with our comprehensive business directory. Search by ABN, company name, or industry. Access detailed business information and company profiles.",
    url: "https://qxweb.com.au",
    images: [
      {
        url: 'https://qxweb.com.au/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QX Web - Australian Business Directory & Company Search',
        type: 'image/png',
      },
    ],
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'Australian business directory, company search, ABN lookup, business information Australia, yellow pages, company details, business search engine, Australian companies database, business finder, company directory, ABN search, business listings Australia, commercial directory, professional services directory, business network Australia, company database, enterprise search, business intelligence Australia, corporate directory, trade directory Australia'
    }
  ]
};

export const companiesPageSEO = {
  title: "Company Search & Business Directory - Find Australian Companies | QX Web",
  description: "Search thousands of Australian companies and businesses. Find detailed company information, ABN details, contact information, and business profiles. Your comprehensive business directory for Australia.",
  canonical: "https://qxweb.com.au/companies",
  openGraph: {
    title: "Company Search & Business Directory - Find Australian Companies | QX Web",
    description: "Search thousands of Australian companies and businesses. Find detailed company information, ABN details, and business profiles.",
    url: "https://qxweb.com.au/companies",
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'company search, Australian companies, business directory, company information, ABN lookup, business details, company profiles, business search, corporate directory, enterprise search, company database Australia, business listings, commercial directory'
    }
  ]
};

export const abnLookupSEO = {
  title: "ABN Lookup & Business Number Search - Australian Business Registry | QX Web",
  description: "Free ABN lookup service for Australian businesses. Search by ABN, ACN, or business name to find detailed company information, registration details, and business status. Official business registry search.",
  canonical: "https://qxweb.com.au/abn-lookup",
  openGraph: {
    title: "ABN Lookup & Business Number Search - Australian Business Registry | QX Web",
    description: "Free ABN lookup service for Australian businesses. Search by ABN, ACN, or business name to find detailed company information and registration details.",
    url: "https://qxweb.com.au/abn-lookup",
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'ABN lookup, ABN search, Australian Business Number, ACN lookup, business number search, business registry Australia, company registration lookup, ABN finder, business number finder, Australian business registry, ABN verification, business registration search'
    }
  ]
}; 