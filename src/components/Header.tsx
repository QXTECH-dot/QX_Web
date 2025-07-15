"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown, X, Menu, User } from "lucide-react";
import { signIn, useSession, signOut } from 'next-auth/react';

export function Header() {
  const [isCompaniesMenuOpen, setIsCompaniesMenuOpen] = useState<boolean>(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState<boolean>(false);
  const [isAnalysisMenuOpen, setIsAnalysisMenuOpen] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  const companiesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session, status } = useSession();

  const handleCompaniesMouseEnter = () => {
    if (companiesTimeoutRef.current) {
      clearTimeout(companiesTimeoutRef.current);
    }
    setIsCompaniesMenuOpen(true);
  };

  const handleCompaniesMouseLeave = () => {
    companiesTimeoutRef.current = setTimeout(() => {
      setIsCompaniesMenuOpen(false);
    }, 300); // 300ms 延迟
  };

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
    }
    setIsServicesMenuOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesMenuOpen(false);
    }, 300); // 300ms 延迟
  };

  const handleAnalysisMouseEnter = () => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
    setIsAnalysisMenuOpen(true);
  };

  const handleAnalysisMouseLeave = () => {
    analysisTimeoutRef.current = setTimeout(() => {
      setIsAnalysisMenuOpen(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (companiesTimeoutRef.current) {
        clearTimeout(companiesTimeoutRef.current);
      }
      if (servicesTimeoutRef.current) {
        clearTimeout(servicesTimeoutRef.current);
      }
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
      {/* Main navigation */}
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center w-full">
          <Link href="/" className="flex items-center mr-8">
            <Image
              src="/QXWeb_logo.jpg"
              alt="QX Web Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <div className="ml-2 flex flex-col">
              <span className="font-bold text-xl">QX</span>
              <span className="font-bold text-xl -mt-1">Web</span>
            </div>
          </Link>

          {/* 菜单整体居中 */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Home
              </Link>
              <div className="relative">
                <Link href="/companies" className="flex items-center gap-1 font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                  Companies
                </Link>
              </div>
              <Link href="/blog" className="font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Blog
              </Link>
              <Link href="/industry-data-visualization" className="font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Industry Data
              </Link>
              <Link href="/about-us" className="font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200">
                About Us
              </Link>
              <Link href="/login" className="ml-2 px-4 py-2 rounded-md bg-[#FFD600] text-black font-semibold text-base hover:bg-[#FFD600]/90 transition-all duration-200 shadow-sm hover:shadow-md">
                List My Company
              </Link>
            </nav>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
          ) : session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:block">Welcome, {session.user?.name || session.user?.email}</span>
              
              {/* User Avatar - Clickable to go to CRM */}
              <Link 
                href="/crm/user/profile"
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-yellow-400 transition-all duration-200"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </Link>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm"
              >
                Log Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm font-medium"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="md:hidden bg-white border-t border-gray-200 absolute w-full z-50 shadow-lg">
            <nav className="container py-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="block py-2 font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/companies"
                    className="block py-2 font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="block py-2 font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/industry-data-visualization"
                    className="block py-2 font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Industry Data
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className="block py-2 font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="block py-2 font-semibold text-base bg-[#FFD600] text-black rounded-md text-center hover:bg-[#FFD600]/90 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    List My Company
                  </Link>
                </li>
                {/* Mobile user-specific links */}
                {session ? (
                  <li>
                    <Link
                      href="/crm/user/profile"
                      className="block py-2 font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile (CRM)
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/login"
                        className="block py-2 font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log In
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/signup"
                        className="block py-2 font-medium text-base text-gray-700 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
