import type { Metadata } from "next";
import "./globals.css";
import { ClientBody } from "./ClientBody";
import { ComparisonProvider } from "@/components/comparison/ComparisonContext";
import {
  organizationStructuredData,
  websiteStructuredData,
  businessDirectoryStructuredData,
} from "@/config/structured-data";
import Script from "next/script";

export const metadata: Metadata = {
  title: "QX Web - Australia's Premier Business Directory & Company Search",
  description:
    "Australia's leading business directory and company search platform. Find ABN lookup, company information, business details, and connect with service providers across all industries. Your trusted yellow pages alternative.",
  keywords:
    "Australian business directory, company search Australia, ABN lookup, business information, yellow pages Australia, company details, business search, Australian companies, business directory, company finder, ABN search, business listings, commercial directory, trade directory, professional services, business network, company database, enterprise search, business intelligence, corporate directory",
  authors: [{ name: "QX Web" }],
  robots:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    title: "QX Web - Australia's Premier Business Directory & Company Search",
    description:
      "Australia's leading business directory and company search platform. Find ABN lookup, company information, business details, and connect with service providers across all industries.",
    url: "https://qxweb.com.au",
    siteName: "QX Web",
    locale: "en-AU",
    type: "website",
    images: [
      {
        url: "https://qxweb.com.au/og-image.png",
        width: 1200,
        height: 630,
        alt: "QX Web - Australian Business Directory & Company Search",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@qxweb",
    creator: "@qxweb",
  },
  manifest: "/manifest.json",
  other: {
    "geo.region": "AU",
    "geo.country": "Australia",
    language: "English",
    distribution: "global",
    rating: "general",
    "revisit-after": "1 day",
    googlebot: "index, follow",
    bingbot: "index, follow",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/QXWeb_logo.jpg" sizes="any" />
        <link rel="apple-touch-icon" href="/QXWeb_logo.jpg" />
        <link rel="logo" href="/QXWeb_logo.jpg" />
        <meta itemProp="logo" content="https://qxweb.com.au/QXWeb_logo.jpg" />
        <meta name="theme-color" content="#E4BF2D" />
        <meta
          name="google-site-verification"
          content="your-google-verification-code"
        />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessDirectoryStructuredData),
          }}
        />
        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MER4ZNDV5H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MER4ZNDV5H');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <ComparisonProvider>
          <ClientBody>{children}</ClientBody>
        </ComparisonProvider>
      </body>
    </html>
  );
}
