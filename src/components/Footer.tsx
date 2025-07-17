"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
}

export function Footer() {
  const [recentPosts, setRecentPosts] = useState<BlogArticle[]>([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch('/api/blog?limit=3');
        const data = await response.json();
        if (data.success) {
          setRecentPosts(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    };

    fetchRecentPosts();
  }, []);
  
  return (
    <footer className="bg-background border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Section */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="text-sm hover:underline">About Us</Link></li>
              <li><Link href="/industries" className="text-sm hover:underline">Industries</Link></li>
              <li><Link href="/industry-data-visualization" className="text-sm hover:underline">Industry Data</Link></li>
              <li><Link href="/state-comparison" className="text-sm hover:underline">State Comparison</Link></li>
              <li><Link href="/get-listed" className="text-sm hover:underline">Get Listed</Link></li>
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/companies" className="text-sm hover:underline">Find Companies</Link></li>
              <li><Link href="/companies/compare" className="text-sm hover:underline">Compare Companies</Link></li>
              <li><Link href="/blog" className="text-sm hover:underline">Blog</Link></li>
              <li><Link href="/events" className="text-sm hover:underline">Events</Link></li>
              <li><Link href="/project-submission" className="text-sm hover:underline">Submit Project</Link></li>
            </ul>
          </div>

          {/* Australian States Section */}
          <div>
            <h3 className="font-bold mb-4">Australian States</h3>
            <ul className="space-y-2">
              <li><Link href="/state/new-south-wales" className="text-sm hover:underline">New South Wales</Link></li>
              <li><Link href="/state/victoria" className="text-sm hover:underline">Victoria</Link></li>
              <li><Link href="/state/queensland" className="text-sm hover:underline">Queensland</Link></li>
              <li><Link href="/state/western-australia" className="text-sm hover:underline">Western Australia</Link></li>
              <li><Link href="/state/south-australia" className="text-sm hover:underline">South Australia</Link></li>
              <li><Link href="/state/australian-capital-territory" className="text-sm hover:underline">ACT</Link></li>
            </ul>
          </div>

          {/* Blog Categories Section */}
          <div>
            <h3 className="font-bold mb-4">Blog Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/blog/category/technology" className="text-sm hover:underline">Technology</Link></li>
              <li><Link href="/blog/category/construction" className="text-sm hover:underline">Construction</Link></li>
              <li><Link href="/blog/category/healthcare" className="text-sm hover:underline">Healthcare</Link></li>
              <li><Link href="/blog/category/finance" className="text-sm hover:underline">Finance</Link></li>
              <li><Link href="/blog/category/education" className="text-sm hover:underline">Education</Link></li>
            </ul>
          </div>

          {/* Recent Blog Posts Section */}
          <div>
            <h3 className="font-bold mb-4">Recent Posts</h3>
            <ul className="space-y-2">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/blog/${post.slug}`} className="text-sm hover:underline line-clamp-2">
                      {post.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">Loading posts...</li>
              )}
            </ul>
          </div>
        </div>

        {/* Contact and Legal Section */}
        <div className="mt-10 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-3">Contact Us</h4>
              <p className="text-sm text-muted-foreground mb-1">Email: info@qxweb.com.au</p>
              <p className="text-sm text-muted-foreground">Australia's premier business directory</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/login" className="hover:underline">Login</Link>
                <Link href="/signup" className="hover:underline">Sign Up</Link>
                <Link href="/company-verify" className="hover:underline">Verify Company</Link>
              </div>
            </div>

            {/* Social & Legal */}
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Cookie Policy</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© Copyright 2025 <Link href="/" className="text-qxnet hover:underline font-semibold">QX Web</Link>. Made in Australia 🇦🇺</p>
            <p className="mt-1">Connecting businesses across Australia - Your trusted business directory since 2024</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
