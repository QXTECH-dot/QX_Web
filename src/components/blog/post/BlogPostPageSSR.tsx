import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Clock } from "lucide-react";
import { BlogContentRenderer } from "../BlogContentRenderer";
import { Blog } from "@/lib/firebase/services/blog";

interface BlogPostPageSSRProps {
  post: Blog | null;
  relatedPosts: Blog[];
  postId: string;
}

export function BlogPostPageSSR({ post, relatedPosts, postId }: BlogPostPageSSRProps) {
  // 如果文章不存在
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

  // 使用默认图片如果没有图片
  const displayImage = post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop';

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        {/* 面包屑导航 */}
        <div className="text-sm mb-6 text-gray-500">
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          {" > "}
          <Link href={`/blog/category/${post.category}`} className="hover:text-primary">
            {post.category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Link>
          {" > "}
          <span className="text-gray-700">{post.title}</span>
        </div>

        {/* 文章标题 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

        {/* 元信息 */}
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
        </div>

        {/* 特色图片 */}
        <div className="relative aspect-[16/9] w-full mb-8 rounded-md overflow-hidden">
          <Image
            src={displayImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            priority
          />
        </div>

        {/* 文章内容 - 服务器端渲染 */}
        <div className="prose prose-lg max-w-none mb-8">
          {post.content && post.content.length > 0 ? (
            <BlogContentRenderer content={post.content} />
          ) : (
            <div className="text-gray-600 italic">
              {post.excerpt || "No content available for this post."}
            </div>
          )}
        </div>

        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: string) => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 相关文章 - 服务器端渲染 */}
      {relatedPosts.length > 0 && (
        <div className="border-t pt-10 mt-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id} 
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={relatedPost.image || displayImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-3">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        <span>{formatDate(relatedPost.publishedAt)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{relatedPost.readTime} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}