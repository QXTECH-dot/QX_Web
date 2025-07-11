"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any[];
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  image: string;
  readTime: number;
  status: string;
  metaTitle: string;
  metaDescription: string;
  views: number;
  isFeatured: boolean;
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

interface BlogCardProps {
  article: BlogArticle;
  featured?: boolean;
}

export function BlogCard({ article, featured = false }: BlogCardProps) {
  const { id, slug, title, category, publishedAt, readTime, image, excerpt } = article;
  
  // 使用默认图片如果没有图片
  const displayImage = image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop';
  
  // 使用默认摘要如果没有摘要
  const displayExcerpt = excerpt || 'Read more about this article...';
  
  console.log('BlogCard rendering:', { id, title, slug, publishedAt });

  if (featured) {
    return (
      <div className="relative w-full overflow-hidden rounded-md">
        <Link href={`/blog/${slug}`} className="block">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={displayImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <span className="text-yellow-400">
                    Featured Post
                  </span>
                </span>
                <Link href={`/blog/category/${category}`} className="hover:underline">
                  {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Link>
                <span>{formatDate(publishedAt)}</span>
              </div>
              <h2 className="mb-4 text-3xl font-bold hover:text-primary transition-colors">
                {title}
              </h2>
              <p className="mb-4 text-sm text-gray-200">{displayExcerpt}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <Link href={`/blog/${slug}`} className="group">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={displayImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <Link href={`/blog/category/${category}`} className="text-sm text-primary font-medium hover:underline">
            {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Link>
          <span className="mx-1 text-xs text-gray-400">{formatDate(publishedAt)}</span>
          <h3 className="mt-2 text-xl font-bold group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="mt-4">
            <Link href={`/blog/${slug}`}>
              <Button variant="link" className="px-0 text-primary">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
}
