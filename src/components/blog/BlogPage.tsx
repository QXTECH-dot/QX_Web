"use client";

import React, { useState, useEffect } from "react";
import { BlogCard } from "./BlogCard";
import { BlogCategoryFilter } from "./BlogCategoryFilter";
import { Button } from "@/components/ui/button";
import { Zap, Loader2 } from "lucide-react";

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

interface BlogPageProps {
  category?: string;
  initialBlogs?: BlogArticle[];
  initialPagination?: { totalPages: number };
}

export function BlogPage({ category = "all", initialBlogs = [], initialPagination = { totalPages: 1 } }: BlogPageProps) {
  const [articles, setArticles] = useState<BlogArticle[]>(initialBlogs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);

  useEffect(() => {
    // Only fetch if we don't have initial data or if category/page changed
    if (initialBlogs.length === 0 || currentPage !== 1) {
      fetchBlogs();
    }
  }, [category, currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(category !== 'all' && { category })
      });
      
      const response = await fetch(`/api/blog?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('BlogPage: Received articles:', data.data);
        setArticles(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setError(data.error || 'Failed to load blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Find featured article only if showing all categories
  const featuredArticle = category === "all" ? articles.find(article => article.isFeatured) : null;

  // All other articles - show all articles if no category filter
  const regularArticles = articles;

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Blog, News and Useful Insights</h1>

      <div className="mb-6 flex items-center">
        <span className="text-sm mr-2">Blog Language</span>
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-200 rounded-md py-1 px-3 pr-8 text-sm">
            <option>English</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Featured article */}
      {featuredArticle && category === "all" && (
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm font-semibold">Featured Post</span>
          </div>
          <BlogCard article={featuredArticle} featured={true} />
        </div>
      )}

      {/* Category filter */}
      <BlogCategoryFilter activeCategory={category} />

      {/* Category description */}
      <p className="text-gray-600 mb-10">
        Besides the latest news and design trends, on QX Web you will find important information about the IT industry in every country and city listed on our website. Tips and hints how to find the best matching company for your future project.
      </p>

      {/* Blog grid */}
      {regularArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {regularArticles.map(article => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No blog posts available yet.</p>
          {category !== 'all' && (
            <p className="text-sm text-gray-500">Try selecting a different category or check back later.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center gap-1">
            {currentPage > 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="font-medium"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
            )}
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant="outline"
                  size="sm"
                  className={`font-medium ${
                    currentPage === pageNum
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : ''
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {totalPages > 5 && (
              <>
                <span className="mx-2">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  className={`font-medium ${
                    currentPage === totalPages
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : ''
                  }`}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
            
            {currentPage < totalPages && (
              <Button 
                variant="outline" 
                size="sm" 
                className="font-medium"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
