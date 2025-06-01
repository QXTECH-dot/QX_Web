export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "QX Web",
  "alternateName": "QX Web Australia",
  "url": "https://qxweb.com.au",
  "logo": "https://qxweb.com.au/QXWeb_logo.jpg",
  "description": "Australia's leading business directory and company search platform. Find ABN lookup, company information, business details, and connect with service providers across all industries.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "AU",
    "addressRegion": "Australia"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://www.facebook.com/qxweb",
    "https://www.linkedin.com/company/qxweb",
    "https://twitter.com/qxweb"
  ]
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "QX Web - Australian Business Directory",
  "alternateName": "QX Web",
  "url": "https://qxweb.com.au",
  "description": "Australia's premier business directory and company search platform. Search companies by ABN, business name, or industry.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://qxweb.com.au/companies?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "QX Web",
    "url": "https://qxweb.com.au"
  }
};

export const businessDirectoryStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "QX Web Business Directory",
  "url": "https://qxweb.com.au",
  "description": "Comprehensive Australian business directory with ABN lookup, company search, and detailed business information for thousands of companies across Australia.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "AUD",
    "description": "Free business directory and company search service"
  },
  "featureList": [
    "Company Search",
    "ABN Lookup",
    "Business Directory",
    "Company Information",
    "Business Listings",
    "Industry Search",
    "Location-based Search"
  ],
  "serviceArea": {
    "@type": "Country",
    "name": "Australia"
  }
};

export const breadcrumbStructuredData = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How can I search for Australian companies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can search for Australian companies using our comprehensive business directory. Simply enter the company name, ABN, industry, or location in our search bar to find detailed business information."
      }
    },
    {
      "@type": "Question",
      "name": "Can I lookup ABN numbers on QX Web?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our platform provides ABN lookup functionality. You can search by ABN number to find detailed company information, registration details, and business status."
      }
    },
    {
      "@type": "Question",
      "name": "Is QX Web a free business directory?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, QX Web is a free Australian business directory. You can search and access company information, business details, and contact information at no cost."
      }
    },
    {
      "@type": "Question",
      "name": "What information can I find about companies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our business directory provides comprehensive company information including business details, contact information, industry classification, location, and other relevant business data."
      }
    }
  ]
}; 