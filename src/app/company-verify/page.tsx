"use client";

import React, { useState } from "react";

export default function CompanyVerifyPage() {
  const [abn, setAbn] = useState("");
  const [status, setStatus] = useState<"idle"|"checking"|"found"|"notfound"|"error">("idle");
  const [company, setCompany] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCheckAbn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("checking");
    setError("");
    setCompany(null);
    // TODO: Replace with real API call
    // Simulate ABN check
    setTimeout(() => {
      if (abn === "12345678901") {
        setCompany({ name: "Demo Company Pty Ltd", abn: "12345678901", industry: "IT Services" });
        setStatus("found");
      } else if (abn.length === 11) {
        setStatus("notfound");
      } else {
        setStatus("error");
        setError("Please enter a valid 11-digit ABN.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Company Verification</h1>
        <form onSubmit={handleCheckAbn} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Enter your company ABN <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={abn}
              onChange={e => setAbn(e.target.value.replace(/\D/g, ""))}
              maxLength={11}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. 12345678901"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-2 rounded bg-primary text-white font-semibold disabled:opacity-50"
            disabled={status === "checking" || abn.length !== 11}
          >
            {status === "checking" ? "Checking..." : "Verify ABN"}
          </button>
        </form>
        <div className="mt-6 min-h-[60px]">
          {status === "found" && company && (
            <div className="bg-green-50 border border-green-200 rounded p-4 text-green-800">
              <div className="font-semibold mb-1">Company Found:</div>
              <div>Name: {company.name}</div>
              <div>ABN: {company.abn}</div>
              <div>Industry: {company.industry}</div>
              {/* TODO: Add claim button and verification logic */}
              <button className="mt-4 px-4 py-2 bg-primary text-white rounded">Apply to Claim</button>
            </div>
          )}
          {status === "notfound" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800">
              <div className="font-semibold mb-1">No company found for this ABN.</div>
              <button className="mt-2 px-4 py-2 bg-primary text-white rounded">Create New Company Profile</button>
            </div>
          )}
          {status === "error" && error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
} 