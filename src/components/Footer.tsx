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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Section */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="text-sm hover:underline">About Us</Link></li>
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
            </ul>
          </div>

          {/* Recent Blog Posts Section */}
          <div>
            <h3 className="font-bold mb-4">Recent Blog Posts</h3>
            <ul className="space-y-2">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/blog/${post.slug}`} className="text-sm hover:underline">
                      {post.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No recent posts</li>
              )}
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
