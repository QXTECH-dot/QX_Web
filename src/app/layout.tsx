import type { Metadata } from "next";
import "./globals.css";
import { ClientBody } from "./ClientBody";
import { ComparisonProvider } from "@/components/comparison/ComparisonContext";

export const metadata: Metadata = {
  title: "QX Net - Australia's Business Directory Across All Industries",
  description: "Connect with top companies and service providers across all industries in Australia. Find partners, insights, and resources for your business needs.",
  keywords: "Australian business directory, industry companies, business services, Australian companies, QX Net",
  authors: [{ name: "QX Net" }],
  openGraph: {
    title: "QX Net - Australia's Leading Business Platform",
    description: "Connect with top companies and service providers across all industries in Australia.",
    url: "https://qxnet.au",
    siteName: "QX Net",
    locale: "en-AU",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#E4BF2D" />
      </head>
      <body suppressHydrationWarning>
        <ComparisonProvider>
          <ClientBody>{children}</ClientBody>
        </ComparisonProvider>
      </body>
    </html>
  );
}
