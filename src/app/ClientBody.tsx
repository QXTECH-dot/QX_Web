"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingComparisonPanel } from "@/components/comparison/FloatingComparisonPanel";
import { useComparison } from "@/components/comparison/ComparisonContext";

interface ClientBodyProps {
  children: React.ReactNode;
}

export function ClientBody({ children }: ClientBodyProps) {
  const { selectedCompanies } = useComparison();
  const isComparisonPage = typeof window !== 'undefined' && window.location.pathname === '/companies/compare';
  const isCrmPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/crm');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow relative">
        <main className={`flex-grow transition-all duration-300 ease-in-out ${isComparisonPage ? 'w-full md:w-[80%]' : 'w-full'}`}>
          {children}
        </main>
        {isComparisonPage && (
          <aside className="hidden md:block w-[20%] border-l border-gray-200 bg-white overflow-auto">
            <FloatingComparisonPanel isFixedPanel={false} />
          </aside>
        )}
      </div>
      {!isCrmPage && <Footer />}
    </div>
  );
}
