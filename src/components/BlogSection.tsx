"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { blogArticles } from "@/data/blogData";

export function BlogSection() {
  return (
    <section className="py-16 bg-[#fdfaf0]">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          QX Web Blogs, News & Researches
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
          Learn about business trends through our articles. Stay on top of changes for your business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogArticles.slice(0, 3).map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="block group">
              <Card className="overflow-hidden cursor-pointer group-hover:shadow-lg transition-shadow">
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
                    <span>{post.publishedAt && !isNaN(Date.parse(post.publishedAt)) ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "No Date"}</span>
                  <span className="mx-2">•</span>
                    <span>{typeof post.readTime === 'number' ? `${post.readTime} min read` : post.readTime}</span>
                </div>
                  <h3 className="font-bold text-lg mb-4">{post.title}</h3>
                  <Button variant="outline" size="sm" asChild>
                    <span>Read More</span>
                  </Button>
              </div>
            </Card>
            </Link>
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
