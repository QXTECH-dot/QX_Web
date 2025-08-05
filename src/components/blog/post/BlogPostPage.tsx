"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import { BlogContentMapper } from "./BlogContentMapper";
import { BlogSocialShare } from "./BlogSocialShare";
import { BlogContentRenderer } from "../BlogContentRenderer";

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

interface BlogPostPageProps {
  postId: string;
  initialPost?: BlogArticle | null;
  initialRelatedPosts?: BlogArticle[];
}

function BlogPostContent({ postId, initialPost = null, initialRelatedPosts = [] }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogArticle | null>(initialPost);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogArticle[]>(initialRelatedPosts);

  useEffect(() => {
    // Only fetch if we don't have initial data
    if (!initialPost) {
      fetchPost();
    }
  }, [postId, initialPost]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${postId}`);
      const data = await response.json();
      
      if (data.success) {
        setPost(data.data);
        // 获取相关文章
        fetchRelatedPosts(data.data.category);
      } else {
        setError(data.error || 'Blog post not found');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (category: string) => {
    try {
      const response = await fetch(`/api/blog?category=${category}&limit=3`);
      const data = await response.json();
      
      if (data.success) {
        // 过滤掉当前文章
        const filtered = data.data.filter((article: BlogArticle) => article.slug !== postId);
        setRelatedPosts(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-8">{error || "The blog post you're looking for doesn't exist or has been removed."}</p>
        <Link href="/blog">
          <Button>Return to Blog</Button>
        </Link>
      </div>
    );
  }

  // 使用默认图片如果没有图片
  const displayImage = post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop';

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
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{post.readTime} min read</span>
          </div>
          <div className="flex items-center">
            <span>By {post.author}</span>
          </div>
          <div className="ml-auto">
            <BlogSocialShare
              title={post.title}
              url={`https://qxnet.au/blog/${post.slug}`}
            />
          </div>
        </div>

        {/* Featured image */}
        <div className="relative aspect-[16/9] w-full mb-8 rounded-md overflow-hidden">
          <Image
            src={displayImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
          />
        </div>

        {/* Post content - use BlogContentRenderer for actual content */}
        <div className="prose prose-lg max-w-none mb-8">
          {post.content && post.content.length > 0 ? (
            <BlogContentRenderer content={post.content} />
          ) : (
            <div className="text-gray-600 italic">
              {post.excerpt || "No content available for this post."}
            </div>
          )}
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="border-t pt-10 mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(article => (
              <div key={article.id} className="flex flex-col">
                <Link href={`/blog/${article.slug}`} className="group">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md mb-4">
                    <Image
                      src={article.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'}
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
                    {formatDate(article.publishedAt)} · {article.readTime} min read
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

export function BlogPostPage({ postId, initialPost, initialRelatedPosts }: BlogPostPageProps) {
  return (
    <Suspense fallback={<div className="container py-16 text-center">Loading...</div>}>
      <BlogPostContent postId={postId} initialPost={initialPost} initialRelatedPosts={initialRelatedPosts} />
    </Suspense>
  );
}
