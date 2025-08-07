"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, ShieldCheck } from "lucide-react";
import { CompanyBindABNProps, ABNStatus } from "../types";

export function CompanyBindABN({ onBind }: CompanyBindABNProps) {
  const [abn, setAbn] = useState("");
  const [status, setStatus] = useState<ABNStatus>("idle");
  const [company, setCompany] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCheckAbn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("checking");
    setError("");
    setCompany(null);
    try {
      const res = await fetch(`/api/companies?abn=${abn}`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const found = data.data[0];
        setCompany({
          name: found.name || found.name_en || found.EntityName,
          abn: found.abn,
          industry: found.industry || found.MainBusinessLocation || "",
        });
        setStatus("found");
      } else {
        setStatus("notfound");
      }
    } catch (err) {
      setStatus("error");
      setError("ABN lookup failed, please try again.");
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-0 md:p-8">
      <div className="flex flex-col items-center mb-8">
        <ShieldCheck className="w-16 h-16 text-primary mb-2" />
        <h1 className="text-3xl font-bold mb-2 text-center">
          Company Verification
        </h1>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            Step 1 of 2
          </span>
        </div>
        <p className="text-gray-600 text-center max-w-xl mb-2">
          ABN verification helps us ensure your company's authenticity and
          protect your account security. Please enter your company's Australian
          Business Number (ABN) to continue.
        </p>
        <p className="text-gray-400 text-xs text-center mb-2">
          ABN must be 11 digits. Example:{" "}
          <span className="font-mono">12345678901</span>
        </p>
      </div>

      <form
        onSubmit={handleCheckAbn}
        className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6"
      >
        <div>
          <label className="block font-medium mb-2 text-lg">
            ABN <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={abn}
              onChange={(e) => setAbn(e.target.value.replace(/\D/g, ""))}
              maxLength={11}
              className="w-full border-2 border-primary/40 focus:border-primary rounded-lg px-5 py-4 text-xl font-mono tracking-widest pr-14"
              placeholder="Enter 11-digit ABN"
              required
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
              <Building2 className="w-7 h-7" />
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-bold text-lg shadow-md hover:bg-yellow-500 transition disabled:opacity-50"
          disabled={status === "checking" || abn.length !== 11}
        >
          <Search className="w-5 h-5 mr-1" />
          {status === "checking" ? "Checking..." : "Verify ABN"}
        </button>

        {error && status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800 text-center">
            {error}
          </div>
        )}
      </form>

      <div className="w-full max-w-xl mt-8">
        {status === "found" && company && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-green-800 text-center shadow">
            <div className="flex flex-col items-center mb-2">
              <Building2 className="w-10 h-10 mb-2 text-green-600" />
              <div className="font-semibold text-lg mb-1">Company Found</div>
            </div>
            <div className="mb-1">
              Name: <span className="font-bold">{company.name}</span>
            </div>
            <div className="mb-1">
              ABN: <span className="font-mono">{company.abn}</span>
            </div>
            <button
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-yellow-500 transition"
              onClick={() => {
                localStorage.setItem(
                  "pendingCompanyVerification",
                  JSON.stringify(company)
                );
                onBind(company);
                router.push("/crm/user/company/email-verify");
              }}
            >
              This is my business
            </button>
          </div>
        )}

        {status === "notfound" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-yellow-800 text-center shadow">
            <div className="font-semibold text-lg mb-2">
              No company found for this ABN.
            </div>
            <button
              className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-yellow-500 transition"
              onClick={() => {
                const newCompany = {
                  abn,
                  name: `Company with ABN ${abn}`,
                  industry: "",
                };
                localStorage.setItem(
                  "pendingCompanyVerification",
                  JSON.stringify(newCompany)
                );
                onBind(newCompany);
                router.push("/crm/user/company/email-verify");
              }}
            >
              Create New Company Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
