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
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-8">
            <div className="w-10 h-10 flex items-center justify-center bg-[#E4BF2D] rounded-full mr-2">
              <span className="text-black font-bold text-xl">QX</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl">QX</span>
              <span className="font-bold text-xl -mt-1">Net</span>
            </div>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="font-medium">
              Home
            </Link>
            
            <div
              className="relative"
              onMouseEnter={handleCompaniesMouseEnter}
              onMouseLeave={handleCompaniesMouseLeave}
            >
              <Link href="/companies" className="flex items-center gap-1 font-medium">
                Companies <ChevronDown className="h-4 w-4" />
              </Link>
              {isCompaniesMenuOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-md bg-white shadow-lg z-10 py-2">
                  <Link href="/companies" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    All Companies
                  </Link>
                  <Link href="/companies?state=nsw" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    New South Wales
                  </Link>
                  <Link href="/companies?state=vic" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Victoria
                  </Link>
                  <Link href="/companies?state=qld" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Queensland
                  </Link>
                  <Link href="/companies?state=act" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Australian Capital Territory
                  </Link>
                  <Link href="/companies?state=sa" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    South Australia
                  </Link>
                  <Link href="/companies?state=wa" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Western Australia
                  </Link>
                  <Link href="/companies?state=tas" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Tasmania
                  </Link>
                  <Link href="/companies?state=nt" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Northern Territory
                  </Link>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={handleAnalysisMouseEnter}
              onMouseLeave={handleAnalysisMouseLeave}
            >
              <button className="flex items-center gap-1 font-medium">
                Analysis Tools <ChevronDown className="h-4 w-4" />
              </button>
              {isAnalysisMenuOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-md bg-white shadow-lg z-10 py-2">
                  <Link href="/state-comparison" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    State Comparison
                  </Link>
                  <Link href="/companies/compare" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Company Comparison
                  </Link>
                </div>
              )}
            </div>

            <Link href="/events" className="font-medium">
              Events
            </Link>

            <Link href="/blog" className="font-medium">
              Blog
            </Link>

            <Link href="/about-us" className="font-medium">
              About Us
            </Link>

            <Link href="/project-submission" className="font-medium">
              Fund My Start-up
            </Link>

            <Link href="/eventbrite" className="font-medium">
              Eventbrite
            </Link>

            <Link href="/get-listed">
              <Button className="bg-qxnet hover:bg-qxnet-600 text-black">
                Get Listed
              </Button>
            </Link>
            <Link 
              href="/crm/user/dashboard" 
              className="bg-qxnet hover:bg-qxnet-600 text-black px-3 py-2 rounded-md text-sm font-semibold"
            >
              CRM
            </Link>
          </nav>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="font-medium hidden md:block">
            Log In
          </Link>
          <Link href="/signup" className="font-medium hidden md:block">
            Sign Up
          </Link>

          {/* Mobile menu button */}
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
                    href="/crm/user/dashboard"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    CRM
                  </Link>
                </li>
                <li>
                  <Link
                    href="/state-comparison"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    State Comparison
                  </Link>
                </li>
                <li>
                  <Link
                    href="/companies/compare"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Company Comparison
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
                <li>
                  <Link
                    href="/events"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Event
                  </Link>
                </li>
                <li>
                  <Link
                    href="/project-submission"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Fund My Start-up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/eventbrite"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Eventbrite
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="block py-2 font-medium"
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
