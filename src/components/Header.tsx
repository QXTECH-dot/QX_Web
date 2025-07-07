"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown, X, Menu } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-background">
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
            <nav className="hidden md:flex items-center gap-10">
              <Link href="/" className="font-bold text-lg tracking-wide text-gray-900">
                Home
              </Link>
              <div className="relative">
                <Link href="/companies" className="flex items-center gap-1 font-bold text-lg tracking-wide text-gray-900">
                  Companies
                </Link>
              </div>
              <Link href="/blog" className="font-bold text-lg tracking-wide text-gray-900">
                Blog
              </Link>
              <Link href="/about-us" className="font-bold text-lg tracking-wide text-gray-900">
                About Us
              </Link>
              <Link href="/login" className="ml-2 px-4 py-2 rounded bg-[#FFD600] text-black font-bold text-lg tracking-wide hover:bg-[#FFD600]/90 transition">
                List My Company
              </Link>
            </nav>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {status === "authenticated" && session?.user ? (
            <div className="relative group">
              <img
                src={session.user.image || "/images/default-company-logo.png"}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full border cursor-pointer"
              />
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">{session.user.name}</div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  退出登录
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="font-bold text-lg tracking-wide text-gray-900 hidden md:block">
                Log In
              </Link>
              <Link href="/signup" className="font-bold text-lg tracking-wide text-gray-900 hidden md:block">
                Sign Up
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="md:hidden bg-white border-t border-gray-200 absolute w-full z-50 shadow-lg">
            <nav className="container py-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="block py-2 font-bold text-lg tracking-wide text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/companies"
                    className="block py-2 font-bold text-lg tracking-wide text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="block py-2 font-bold text-lg tracking-wide text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className="block py-2 font-bold text-lg tracking-wide text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="block py-2 font-bold text-lg tracking-wide bg-[#FFD600] text-black rounded text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    List My Company
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="block py-2 font-bold text-lg tracking-wide text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="block py-2 font-bold text-lg tracking-wide text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
