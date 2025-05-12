import type { Metadata } from "next";
import "./globals.css";
import { ClientBody } from "./ClientBody";
import { ComparisonProvider } from "@/components/comparison/ComparisonContext";
import { CompareButton } from "@/components/comparison/CompareButton";

export const metadata: Metadata = {
  title: "Top IT Companies for Your Projects - TechBehemoths Clone",
  description: "Find the best IT company for your next project. Select from thousands of companies in hundreds of countries and cities. Hire the leading tech companies in your region!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ComparisonProvider>
          <ClientBody>
            <div className="min-h-screen">
              {children}
            </div>
          </ClientBody>
          <CompareButton />
        </ComparisonProvider>
      </body>
    </html>
  );
}
