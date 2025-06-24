"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown, X, Menu } from "lucide-react";

export function Header() {
  const [isCompaniesMenuOpen, setIsCompaniesMenuOpen] = useState<boolean>(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState<boolean>(false);
  const [isAnalysisMenuOpen, setIsAnalysisMenuOpen] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  const companiesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
              <Link href="/" className="font-medium">
                Home
              </Link>
              <div
                className="relative"
              >
                <Link href="/companies" className="flex items-center gap-1 font-medium">
                  Companies
                </Link>
              </div>
              <Link href="/blog" className="font-medium">
                Blog
              </Link>
              <Link href="/about-us" className="font-medium">
                About Us
              </Link>
            </nav>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/*
          <Link href="/login" className="font-medium hidden md:block">
            Log In
          </Link>
          <Link href="/signup" className="font-medium hidden md:block">
            Sign Up
          </Link>
          */}
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
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/companies"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
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
