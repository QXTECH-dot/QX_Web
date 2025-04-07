"use client";

import React, { useState } from "react";

export function CompanyProfileTest() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-background py-10">
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">CustomerLabs Test</h1>

        {/* Tabs Navigation */}
        <div className="border-b mb-8">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === "services"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("services")}
            >
              Services
            </button>
            <button
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Company History
            </button>
            <button
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === "portfolio"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("portfolio")}
            >
              Portfolio
            </button>
            <button
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === "reviews"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Overview Content</h2>
              <p>This is the overview tab content.</p>
            </div>
          )}

          {activeTab === "services" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Services Content</h2>
              <p>This is the services tab content.</p>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Company History Content</h2>
              <p>This is the company history tab content.</p>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Portfolio Content</h2>
              <p>This is the portfolio tab content.</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Reviews Content</h2>
              <p>This is the reviews tab content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
