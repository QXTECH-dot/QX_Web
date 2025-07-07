"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingComparisonPanel } from "@/components/comparison/FloatingComparisonPanel";
import { useComparison } from "@/components/comparison/ComparisonContext";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

interface ClientBodyProps {
  children: React.ReactNode;
}

export function ClientBody({ children }: ClientBodyProps) {
  const { selectedCompanies } = useComparison();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  const isComparisonPage = pathname === '/companies/compare';
  const isCrmPage = (pathname && pathname.startsWith('/crm')) ?? false;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-grow relative">
          <main className={`flex-grow transition-all duration-300 ease-in-out ${isComparisonPage ? 'w-full md:w-[80%]' : 'w-full'}`}>
            {children}
          </main>
          {!isComparisonPage && selectedCompanies.length > 0 && (
            <aside className="hidden md:block w-[20%] border-l border-gray-200 bg-white overflow-auto">
              <FloatingComparisonPanel isFixedPanel={false} />
            </aside>
          )}
        </div>
        {!isCrmPage && <Footer />}
      </div>
    </SessionProvider>
  );
}
