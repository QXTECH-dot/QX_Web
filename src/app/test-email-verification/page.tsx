"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Mail } from "lucide-react";

export default function TestEmailVerificationPage() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("QIXIN CO PTY LTD");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "sent" | "verified">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          companyName,
          action: 'send-code'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess("Verification code sent successfully!");
        setStep("sent");
      } else {
        setError(data.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          companyName,
          action: 'verify-code',
          code: code.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess("Email verified successfully!");
        setStep("verified");
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setError("Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setCode("");
    setStep("input");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification Test</h1>
          <p className="text-gray-600">Test the email verification functionality</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Verification
            </CardTitle>
            <CardDescription>
              Test the email verification process with different email addresses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="w-full"
              />
            </div>

            {/* Step 1: Email Input */}
            {step === "input" && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@company.com.au"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Try different email domains to test validation
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full"
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </Button>

                {/* Test Examples */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Test Examples:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">✅ Valid:</span>
                      <span className="text-blue-600">john@qixin.com.au</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">✅ Valid:</span>
                      <span className="text-blue-600">admin@mycompany.com.au</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">❌ Invalid:</span>
                      <span className="text-red-600">user@gmail.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">❌ Invalid:</span>
                      <span className="text-red-600">test@fakecompany.com</span>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Step 2: Code Verification */}
            {step === "sent" && (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="text-center text-green-700 mb-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>A verification code has been sent to your email.</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Check the console for the verification code (development mode)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    maxLength={6}
                    className="w-full text-center text-lg font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("input")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !code}
                    className="flex-1"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Success */}
            {step === "verified" && (
              <div className="text-center space-y-4">
                <div className="text-green-700">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Email Verified Successfully!</h3>
                  <p className="text-sm text-gray-600">
                    The email verification process is complete.
                  </p>
                </div>

                <Button onClick={resetForm} className="w-full">
                  Test Another Email
                </Button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{success}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Panel */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Validates email format and rejects personal email domains</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Checks DNS MX records to verify domain authenticity</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Suggests but doesn't require domain to match company name</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Sends verification code with 10-minute expiration</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 