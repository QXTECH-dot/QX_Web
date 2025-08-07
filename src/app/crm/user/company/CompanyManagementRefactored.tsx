"use client";

import React from "react";
import Sidebar from "@/components/crm/shared/layout/Sidebar";
import { useCompanyManagement } from "./hooks/useCompanyManagement";
import { CompanyBindABN } from "./components/CompanyBindABN";

export default function CompanyManagementRefactored() {
  const {
    boundCompany,
    setBoundCompany,
    loading,
    error,
    timeout,
    isCheckingBind,
    handleRefresh,
    handleReLogin,
  } = useCompanyManagement();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
        {(loading || isCheckingBind) && !timeout && <div>Loading...</div>}

        {loading && timeout && (
          <div className="text-red-500 mb-4">
            Session timeout, please refresh or log in again.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="text-red-800 mb-2">{error}</div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Refresh Page
              </button>
              {error.includes("login session has expired") && (
                <button
                  onClick={handleReLogin}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Re-login
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && !isCheckingBind && (
          <CompanyBindABN onBind={setBoundCompany} />
        )}
      </main>
    </div>
  );
}
