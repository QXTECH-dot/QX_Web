"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

// Sample data for blog posts
const blogPosts = [
  {
    id: "post-1",
    title: "Why Are Tech Companies Moving To Texas?",
    image: "https://ext.same-assets.com/3273624843/1546461295.webp",
    date: "2025-03-20",
    readTime: "10 min read",
  },
  {
    id: "post-2",
    title: "How The Blockchain Is Impacting The Automotive Industry In Poland",
    image: "https://ext.same-assets.com/3273624843/2821177495.webp",
    date: "2025-03-15",
    readTime: "8 min read",
  },
  {
    id: "post-3",
    title: "Which Industries Face the Most Cyber Attacks?",
    image: "https://ext.same-assets.com/1651653002/3908739540.webp",
    date: "2025-03-10",
    readTime: "12 min read",
  },
];

export function BlogSection() {
  return (
    <section className="py-16 bg-[#fdfaf0]">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          QX Net Blogs, News & Researches
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
          Learn about business trends through our articles. Stay on top of changes for your business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-bold text-lg mb-4">
                  <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <Link href={`/blog/${post.id}`}>
                  <Button variant="outline" size="sm">
                    Read More
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
