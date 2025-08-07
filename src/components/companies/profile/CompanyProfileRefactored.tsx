"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileCompareButton } from "@/components/comparison/ProfileCompareButton";

// Import refactored components
import { CompanyProfileProps, OfficeType } from "./types";
import { CompanyHeader } from "./CompanyHeader";
import { CompanyKeyFacts } from "./CompanyKeyFacts";
import { CompanyTabNavigation } from "./CompanyTabNavigation";
import { OverviewTab } from "./tabs/OverviewTab";
import { ServicesTab } from "./tabs/ServicesTab";
import { HistoryTab } from "./tabs/HistoryTab";
import { ReviewsTab } from "./tabs/ReviewsTab";
import { ContactTab } from "./tabs/ContactTab";
import { SimilarCompanies } from "./SimilarCompanies";

// Import hooks
import { useCompanyData } from "./hooks/useCompanyData";
import { useServiceData } from "./hooks/useServiceData";
import { useOfficeData } from "./hooks/useOfficeData";
import { useCompanyHistory } from "./hooks/useCompanyHistory";
import { useSimilarCompanies } from "./hooks/useSimilarCompanies";

export function CompanyProfileRefactored({
  id,
  initialData,
}: CompanyProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedOffice, setSelectedOffice] = useState<OfficeType | null>(null);

  // References for scrolling
  const contactRef = useRef<HTMLDivElement>(null);

  // Custom hooks for data fetching
  const { company, loading, error } = useCompanyData(id, initialData);
  const {
    services,
    loading: serviceLoading,
    error: serviceError,
  } = useServiceData(id);
  const { offices, loading: officesLoading } = useOfficeData(id);
  const {
    history,
    loading: historyLoading,
    error: historyError,
  } = useCompanyHistory(id);
  const { similarCompanies, loading: similarLoading } =
    useSimilarCompanies(company);

  console.log("CompanyProfile component received ID:", id);

  // Set default selected office
  useEffect(() => {
    if (offices && offices.length > 0) {
      setSelectedOffice(offices[0]);
    } else {
      setSelectedOffice(null);
    }
  }, [offices]);

  // Scroll functions
  const scrollToServices = () => {
    setActiveTab("services");
    setTimeout(() => {
      const tabsNav = document.querySelector(".border-b.mb-8");
      if (tabsNav) {
        const navRect = tabsNav.getBoundingClientRect();
        const scrollPosition = window.pageYOffset + navRect.top - 100;
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const scrollToContact = () => {
    setActiveTab("contact");
    if (contactRef.current) {
      const offset = 100;
      const elementPosition = contactRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Handle office selection
  const handleOfficeSelect = (office: OfficeType) => {
    setSelectedOffice(office);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-background py-10">
        <div className="container">
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm h-40 flex items-center justify-center">
            <p className="text-lg text-muted-foreground">
              Loading company details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !company) {
    return (
      <div className="bg-background py-10">
        <div className="container">
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-muted-foreground">
              {error || "Company details not found"}
            </p>
            <Button className="mt-4" asChild>
              <Link href="/companies">Back to companies list</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            company={company}
            offices={offices}
            officesLoading={officesLoading}
            selectedOffice={selectedOffice}
            onOfficeSelect={handleOfficeSelect}
          />
        );
      case "services":
        return (
          <ServicesTab
            services={services}
            loading={serviceLoading}
            error={serviceError}
          />
        );
      case "history":
        return (
          <HistoryTab
            history={history}
            loading={historyLoading}
            error={historyError}
          />
        );
      case "reviews":
        return <ReviewsTab reviews={company.reviews || []} />;
      case "contact":
        return <ContactTab company={company} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-background py-4 sm:py-10">
      <div className="container mx-auto px-0">
        {/* Company Header */}
        <CompanyHeader
          company={company}
          offices={offices}
          onContactClick={scrollToContact}
          onServicesClick={scrollToServices}
        />

        {/* Company Comparison */}
        <div>
          <ProfileCompareButton company={company} />
        </div>

        {/* Key Facts Bar */}
        <CompanyKeyFacts company={company} />

        {/* Tabs Navigation */}
        <div ref={contactRef}>
          <CompanyTabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            company={company}
          />
        </div>

        {/* Tab Content */}
        <div className="mb-8">{renderTabContent()}</div>

        {/* Similar Companies */}
        <SimilarCompanies
          companies={similarCompanies}
          loading={similarLoading}
        />
      </div>
    </div>
  );
}
