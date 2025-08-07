"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";

export function Header() {
  const [isCompaniesMenuOpen, setIsCompaniesMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      {/* Awards banner */}
      {showBanner && (
        <div className="bg-[#0a1926] text-white py-2 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="https://ext.same-assets.com/1651653002/508600370.svg"
              alt="Award Logo"
              width={30}
              height={30}
              className="mr-2"
            />
            <span className="text-[#E4BF2D] font-bold mr-1">QX NET</span>
            <span className="text-[#E4BF2D] font-bold mr-2">AWARDS</span>
            <span className="mr-2">Discover the</span>
            <span className="font-bold mr-1">best companies of the year</span>
          </div>
          <div className="flex items-center">
            <Link href="/awards">
              <Button variant="link" className="text-white p-0">
                Check out the winners!
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 ml-2 text-white"
              onClick={() => setShowBanner(false)}
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      )}

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

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setIsCompaniesMenuOpen(true)}
              onMouseLeave={() => setIsCompaniesMenuOpen(false)}
            >
              <Link href="/companies" className="flex items-center gap-1 font-medium">
                Companies <ChevronDown className="h-4 w-4" />
              </Link>
              {isCompaniesMenuOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-md bg-white shadow-lg z-10 py-2">
                  <Link href="/companies" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    All Companies
                  </Link>
                  <Link href="/companies?location=nsw" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    New South Wales
                  </Link>
                  <Link href="/companies?location=vic" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Victoria
                  </Link>
                  <Link href="/companies?location=qld" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Queensland
                  </Link>
                  <Link href="/companies?location=act" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Australian Capital Territory
                  </Link>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setIsServicesMenuOpen(true)}
              onMouseLeave={() => setIsServicesMenuOpen(false)}
            >
              <button className="flex items-center gap-1 font-medium">
                Industries <ChevronDown className="h-4 w-4" />
              </button>
              {isServicesMenuOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-md bg-white shadow-lg z-10 py-2">
                  <Link href="/companies?industry=finance" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Finance
                  </Link>
                  <Link href="/companies?industry=construction" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Construction
                  </Link>
                  <Link href="/companies?industry=accounting" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Accounting
                  </Link>
                  <Link href="/companies?industry=education" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    Education
                  </Link>
                  <Link href="/companies?industry=it" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    IT & Technology
                  </Link>
                  <Link href="/industries" className="block px-4 py-2 text-sm hover:bg-qxnet-50">
                    All Industries
                  </Link>
                </div>
              )}
            </div>

            <Link href="/blog" className="font-medium">
              Blog
            </Link>

            <Link href="/events" className="font-medium">
              Event
            </Link>

            <Link href="/project-submission" className="font-medium">
              Fund My Start-up
            </Link>
          </nav>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="font-medium hidden md:block">
            Log In
          </Link>
          <Link href="/get-listed">
            <Button className="bg-qxnet hover:bg-qxnet-600 text-black">
              Get Listed
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
