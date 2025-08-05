"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogArticle, blogArticles } from "@/data/blogData";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Clock, Share2 } from "lucide-react";
import { BlogContentMapper } from "./BlogContentMapper";
import { BlogSocialShare } from "./BlogSocialShare";

interface BlogPostPageProps {
  postId: string;
}

export function BlogPostPage({ postId }: BlogPostPageProps) {
  // Find the blog post data
  const post = blogArticles.find(article => article.id === postId);

  if (!post) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog">
          <Button>Return to Blog</Button>
        </Link>
      </div>
    );
  }

  // Get related posts (same category)
  const relatedPosts = blogArticles
    .filter(article => article.category === post.category && article.id !== post.id)
    .slice(0, 3);

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-sm mb-6 text-gray-500">
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          {" > "}
          <Link href={`/blog/category/${post.category}`} className="hover:text-primary">
            {post.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Link>
          {" > "}
          <span className="text-gray-700">{post.title}</span>
        </div>

        {/* Post title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

        {/* Meta information with social share */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-1" />
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{post.readTime}</span>
          </div>
          <div className="ml-auto">
            <BlogSocialShare
              title={post.title}
              url={`https://qxweb.com/blog/${post.slug}`}
            />
          </div>
        </div>

        {/* Featured image */}
        <div className="relative aspect-[16/9] w-full mb-8 rounded-md overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
          />
        </div>

        {/* Post content - use content mapper instead of placeholder */}
        <BlogContentMapper postId={postId} />
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="border-t pt-10 mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(article => (
              <div key={article.id} className="flex flex-col">
                <Link href={`/blog/${article.id}`} className="group">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md mb-4">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                  <h3 className="font-bold group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="text-sm text-gray-500 mt-2">
                    {formatDate(article.date)} · {article.readTime}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
