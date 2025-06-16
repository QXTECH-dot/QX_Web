"use client";

import { useState } from "react";
import Sidebar from '@/components/crm/shared/layout/Sidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// TODO: Replace with real company info from context or props
const MOCK_COMPANY = {
  name: "QIXIN CO PTY LTD",
  abn: "75671782540"
};

export default function EmailVerifyPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "sent" | "verified">("input");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@") || email.endsWith("@gmail.com")) {
      setError("Please enter a valid company email address.");
      return;
    }
    setStep("sent");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) {
      setError("Please enter the code.");
      return;
    }
    setStep("verified");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/crm/user/company" className="hover:underline">Company Bind</Link>
          <span className="mx-1">&gt;</span>
          <span className="text-gray-400">ABN Verification</span>
          <span className="mx-1">&gt;</span>
          <span className="text-primary font-semibold">Email Verification</span>
        </nav>
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8 flex flex-col gap-6">
          {/* Company Info */}
          <div className="flex flex-col items-center mb-2">
            <div className="text-lg font-bold text-primary mb-1">{MOCK_COMPANY.name}</div>
            <div className="text-gray-500 text-sm mb-2">ABN: <span className="font-mono">{MOCK_COMPANY.abn}</span></div>
          </div>
          {/* Description */}
          <div className="text-center text-gray-700 mb-4">
            To verify your management rights for <span className="font-semibold">{MOCK_COMPANY.name}</span>, please verify your company email address.
          </div>
          {step === "input" && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block font-medium mb-1">Company Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="your.name@company.com.au"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-2 rounded bg-primary text-white font-semibold"
              >
                Send Verification Code
              </button>
              {error && <div className="text-red-600 text-center">{error}</div>}
              <div className="flex justify-between mt-2">
                <Link href="/crm/user/company" className="text-primary hover:underline">&larr; Back to previous step</Link>
              </div>
            </form>
          )}
          {step === "sent" && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center text-green-700 mb-2">A verification code has been sent to your email.</div>
              <div>
                <label className="block font-medium mb-1">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter code"
                  required
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-2 rounded bg-primary text-white font-semibold"
              >
                Verify
              </button>
              {error && <div className="text-red-600 text-center">{error}</div>}
              <div className="flex justify-between mt-2">
                <button type="button" className="text-primary hover:underline" onClick={() => setStep("input")}>← Back to previous step</button>
              </div>
            </form>
          )}
          {step === "verified" && (
            <div className="text-center text-green-700 font-bold flex flex-col items-center gap-6">
              <div>
                Email verified successfully!<br />You may now continue to complete your company profile.
              </div>
              <button
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-yellow-500 transition"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('companyBound', '1');
                  }
                  router.push('/crm/user/company');
                }}
              >
                Proceed to Complete Company Profile
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 