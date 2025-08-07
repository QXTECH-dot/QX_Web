"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Section */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="text-sm hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:underline">Contact us</Link></li>
              <li><Link href="/careers" className="text-sm hover:underline">Careers</Link></li>
              <li><Link href="/faq" className="text-sm hover:underline">FAQs</Link></li>
              <li><Link href="/terms" className="text-sm hover:underline">Terms of Service</Link></li>
              <li><Link href="/improve-ranking" className="text-sm hover:underline">Improve Ranking</Link></li>
            </ul>
          </div>

          {/* Industries Section */}
          <div>
            <h3 className="font-bold mb-4">Industries</h3>
            <ul className="space-y-2">
              <li><Link href="/companies/finance" className="text-sm hover:underline">Finance</Link></li>
              <li><Link href="/companies/construction" className="text-sm hover:underline">Construction</Link></li>
              <li><Link href="/companies/accounting" className="text-sm hover:underline">Accounting</Link></li>
              <li><Link href="/companies/education" className="text-sm hover:underline">Education</Link></li>
              <li><Link href="/companies/it-technology" className="text-sm hover:underline">IT & Technology</Link></li>
              <li><Link href="/companies/healthcare" className="text-sm hover:underline">Healthcare</Link></li>
              <li><Link href="/industries" className="text-sm hover:underline">See all</Link></li>
            </ul>
          </div>

          {/* Australian States Section */}
          <div>
            <h3 className="font-bold mb-4">Australian States</h3>
            <ul className="space-y-2">
              <li><Link href="/companies/nsw" className="text-sm hover:underline">New South Wales</Link></li>
              <li><Link href="/companies/vic" className="text-sm hover:underline">Victoria</Link></li>
              <li><Link href="/companies/qld" className="text-sm hover:underline">Queensland</Link></li>
              <li><Link href="/companies/wa" className="text-sm hover:underline">Western Australia</Link></li>
              <li><Link href="/companies/sa" className="text-sm hover:underline">South Australia</Link></li>
              <li><Link href="/companies/act" className="text-sm hover:underline">Australian Capital Territory</Link></li>
              <li><Link href="/states" className="text-sm hover:underline">See all</Link></li>
            </ul>
          </div>

          {/* Cities Section */}
          <div>
            <h3 className="font-bold mb-4">Australian Cities</h3>
            <ul className="space-y-2">
              <li><Link href="/companies/sydney" className="text-sm hover:underline">Sydney</Link></li>
              <li><Link href="/companies/melbourne" className="text-sm hover:underline">Melbourne</Link></li>
              <li><Link href="/companies/brisbane" className="text-sm hover:underline">Brisbane</Link></li>
              <li><Link href="/companies/perth" className="text-sm hover:underline">Perth</Link></li>
              <li><Link href="/companies/adelaide" className="text-sm hover:underline">Adelaide</Link></li>
              <li><Link href="/companies/canberra" className="text-sm hover:underline">Canberra</Link></li>
              <li><Link href="/cities" className="text-sm hover:underline">See all</Link></li>
            </ul>
          </div>

          {/* Insights Section */}
          <div>
            <h3 className="font-bold mb-4">Insights</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm hover:underline">Blog</Link></li>
              <li>
                <a
                  href="https://www.linkedin.com/company/qxnet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/qxnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/QXNet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/qxnet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-10 pt-6 border-t text-sm text-muted-foreground">
          <p>© Copyright 2025 <Link href="/" className="text-qxnet hover:underline">QX Web</Link>. Made in Australia</p>
        </div>
      </div>
    </footer>
  );
}
