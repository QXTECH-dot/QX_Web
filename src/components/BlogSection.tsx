"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  image: string;
  readTime: number;
  category: string;
  author: string;
}

export function BlogSection() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog?limit=3');
        const data = await response.json();
        
        if (data.success) {
          setArticles(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  return (
    <section className="py-16 bg-[#fdfaf0]">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          QX Web Blogs, News & Researches
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
          Learn about business trends through our articles. Stay on top of changes for your business.
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                <Card className="overflow-hidden cursor-pointer group-hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <span>{post.publishedAt && !isNaN(Date.parse(post.publishedAt)) ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "No Date"}</span>
                    <span className="mx-2">•</span>
                      <span>{post.readTime} min read</span>
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts available yet.</p>
          </div>
        )}

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
