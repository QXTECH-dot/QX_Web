"use client";

import { useState, useEffect } from "react";
import Sidebar from '@/components/crm/shared/layout/Sidebar';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

// TODO: Replace with real company info from context or props
const MOCK_COMPANY = {
  name: "QIXIN CO PTY LTD",
  abn: "75671782540"
};

// 常见个人邮箱域名列表
const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'qq.com', '163.com', '126.com', 'sina.com', 'sohu.com',
  'live.com', 'msn.com', 'aol.com', 'protonmail.com', 'tutanota.com'
];

// 验证邮箱域名是否合理（更宽松的验证）
function validateCompanyEmail(email: string, companyName: string): { isValid: boolean; error?: string } {
  if (!email || !email.includes("@")) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  const domain = email.split("@")[1]?.toLowerCase();
  
  // 检查是否是个人邮箱
  if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
    return { isValid: false, error: "Please use your company email address, not a personal email." };
  }

  // 检查域名格式
  if (!domain || domain.length < 3 || !domain.includes(".")) {
    return { isValid: false, error: "Please enter a valid company email domain." };
  }

  // 更宽松的匹配：只要域名包含公司名称的任何关键词即可，或者域名长度合理
  const companyWords = companyName.toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .split(' ')
    .filter(word => word.length > 2);
  
  const domainParts = domain.split('.');
  const mainDomain = domainParts[0];
  
  // 检查域名是否包含公司名称的关键词
  const hasCompanyKeyword = companyWords.some(word => 
    mainDomain.includes(word) || word.includes(mainDomain)
  );

  // 如果域名长度合理且没有匹配到公司关键词，给出友好提示但不拒绝
  if (!hasCompanyKeyword && mainDomain.length > 3) {
    console.log(`[Frontend] Warning: Domain "${domain}" doesn't match company "${companyName}", but allowing for better UX`);
    // 不再返回错误，允许用户继续
  }

  return { isValid: true };
}

export default function EmailVerifyPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "sent" | "verified">("input");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // 获取公司信息（从URL参数或localStorage）
  useEffect(() => {
    // 尝试从localStorage获取ABN验证后的公司信息
    const savedCompany = localStorage.getItem('pendingCompanyVerification');
    if (savedCompany) {
      try {
        const parsed = JSON.parse(savedCompany);
        setCompanyData(parsed);
        console.log('[Email Verify] Loaded company data:', parsed);
      } catch (e) {
        console.error('[Email Verify] Failed to parse company data:', e);
      }
    }
    
    // 如果没有公司信息，使用默认值
    if (!companyData) {
      setCompanyData(MOCK_COMPANY);
    }
  }, []);

  // 倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // 使用改进的邮箱验证
    const currentCompanyName = companyData?.name || MOCK_COMPANY.name;
    const validation = validateCompanyEmail(email, currentCompanyName);
    if (!validation.isValid) {
      setError(validation.error || "Invalid email address.");
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          companyName: currentCompanyName,
          action: 'send-code'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStep("sent");
        // 设置60秒冷却时间
        setResendCooldown(60);
      } else {
        setError(data.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError("Failed to send verification code. Please try again.");
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown} seconds before resending.`);
      return;
    }

    setResending(true);
    setError("");
    
    const currentCompanyName = companyData?.name || MOCK_COMPANY.name;

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          companyName: currentCompanyName,
          action: 'send-code'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // 设置60秒冷却时间
        setResendCooldown(60);
        setError(""); // 清除之前的错误
        setResendSuccess(true);
        console.log('[Email Verify] Verification code resent successfully');
        
        // 3秒后清除成功消息
        setTimeout(() => {
          setResendSuccess(false);
        }, 3000);
      } else {
        setError(data.error || "Failed to resend verification code");
      }
    } catch (error) {
      console.error('Error resending verification code:', error);
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleCompanyBinding = async () => {
    try {
      setSaving(true);
      setError("");
      
      // 获取用户邮箱
      const userAny = session?.user as any;
      const userEmail = userAny?.email;
      
      if (!userEmail) {
        setError("User email information not available. Please re-login.");
        return;
      }
      
      if (!companyData) {
        setError("Company information not available. Please restart the verification process.");
        return;
      }

      console.log('[Email Verify] Saving company binding...', { userEmail, companyData, email });

      const response = await fetch('/api/companies/bind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyData,
          email: userEmail, // 使用用户邮箱
          role: 'owner'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('[Email Verify] Company binding successful:', result.data);
        // 清理临时数据
        localStorage.removeItem('pendingCompanyVerification');
        // 设置绑定完成标记
        localStorage.setItem('companyBound', '1');
        // 绑定成功，不设置错误
        setError("");
      } else {
        console.error('[Email Verify] Company binding failed:', result);
        setError(`Company binding failed: ${result.error || 'Unknown error'}`);
        // 如果有详细错误信息，也显示出来
        if (result.details) {
          console.error('[Email Verify] Error details:', result.details);
        }
      }
      
    } catch (error: any) {
      console.error('[Email Verify] Error binding company:', error);
      setError("Failed to save company binding. Please contact support.");
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) {
      setError("Please enter the code.");
      return;
    }
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          companyName: companyData?.name || MOCK_COMPANY.name,
          action: 'verify-code',
          code: code.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStep("verified");
        // 验证成功后，保存公司绑定关系
        await handleCompanyBinding();
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setError("Failed to verify code. Please try again.");
    }
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
            <div className="text-lg font-bold text-primary mb-1">{companyData?.name || MOCK_COMPANY.name}</div>
            <div className="text-gray-500 text-sm mb-2">ABN: <span className="font-mono">{companyData?.abn || MOCK_COMPANY.abn}</span></div>
          </div>
          {/* Description */}
          <div className="text-center text-gray-700 mb-4">
            To verify your management rights for <span className="font-semibold">{companyData?.name || MOCK_COMPANY.name}</span>, please verify your company email address.
          </div>
          
          {/* 安全提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <div className="font-semibold mb-1">💡 Tips:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>Use your official company email address</li>
              <li>Personal email addresses (Gmail, Yahoo, etc.) are not accepted</li>
              <li>We recommend using an email that matches your company name</li>
            </ul>
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
                <div className="text-xs text-gray-500 mt-1">
                  Example: john.smith@{(companyData?.name || MOCK_COMPANY.name).toLowerCase().replace(/\s+/g, '')}.com.au
                </div>
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
              <div className="text-center text-green-700 mb-2">
                A verification code has been sent to <strong>{email}</strong>
              </div>

              {/* 重新发送成功消息 */}
              {resendSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-green-700 text-sm font-medium">
                    ✅ New verification code sent successfully!
                  </div>
                </div>
              )}
              
              <div>
                <label className="block font-medium mb-1">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter 6-digit code"
                  required
                  maxLength={6}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Please check your email inbox (and spam folder) for the verification code.
                </div>
              </div>

              {/* 重新发送验证码区域 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-700 mb-2">
                  Didn't receive the code?
                </div>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending || resendCooldown > 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    resending || resendCooldown > 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {resending ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </span>
                  ) : resendCooldown > 0 ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-400 relative overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 w-full h-full bg-blue-600 rounded-full transition-all duration-1000"
                          style={{
                            transform: `scaleY(${(60 - resendCooldown) / 60})`,
                            transformOrigin: 'bottom'
                          }}
                        ></div>
                      </div>
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    'Resend Code'
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-2 rounded bg-primary text-white font-semibold"
              >
                Verify
              </button>
              {error && <div className="text-red-600 text-center">{error}</div>}
              <div className="flex justify-between items-center mt-2">
                <button type="button" className="text-primary hover:underline" onClick={() => setStep("input")}>← Back to previous step</button>
                <button 
                  type="button" 
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => {
                    setStep("input");
                    setCode("");
                    setError("");
                    setResendCooldown(0);
                    setResendSuccess(false);
                  }}
                >
                  Change email address
                </button>
              </div>
            </form>
          )}
          
          {step === "verified" && (
            <div className="text-center font-bold flex flex-col items-center gap-6">
              {!error ? (
                // 成功状态
                <div className="text-green-700">
                  <div>
                    Email verified successfully!
                    <br />
                    {saving ? "Saving company binding..." : "Company binding completed!"}
                  </div>
                  
                  {saving && (
                    <div className="flex items-center gap-2 text-blue-600 mt-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                      <span>Saving your company information...</span>
                    </div>
                  )}
                  
                  {!saving && (
                    <button
                      className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-yellow-500 transition"
                      onClick={() => {
                        router.push('/crm/user/company/overview');
                      }}
                    >
                      Go to Company Dashboard
                    </button>
                  )}
                </div>
              ) : (
                // 错误状态
                <div className="text-red-700">
                  <div className="mb-4">
                    Email verified successfully, but there was an error saving your company information.
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="text-sm text-red-800">
                      <strong>Error:</strong> {error}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                      onClick={async () => {
                        setError("");
                        await handleCompanyBinding();
                      }}
                      disabled={saving}
                    >
                      {saving ? "Retrying..." : "Retry Binding"}
                    </button>
                    
                    <button
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold shadow hover:bg-gray-700 transition"
                      onClick={() => {
                        setStep("input");
                        setCode("");
                        setError("");
                        setResendCooldown(0);
                        setResendSuccess(false);
                      }}
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 