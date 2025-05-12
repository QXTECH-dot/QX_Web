"use client";

import React from "react";
import { BlogCard } from "./BlogCard";
import { BlogCategoryFilter } from "./BlogCategoryFilter";
import { Button } from "@/components/ui/button";
import { blogArticles } from "@/data/blogData";
import { Zap } from "lucide-react";

interface BlogPageProps {
  category?: string;
}

export function BlogPage({ category = "all" }: BlogPageProps) {
  // Filter articles based on category if specified
  const articles = category !== "all"
    ? blogArticles.filter(article => article.category === category)
    : blogArticles;

  // Find featured article
  const featuredArticle = blogArticles.find(article => article.isFeatured);

  // All other articles
  const regularArticles = category !== "all"
    ? articles
    : articles.filter(article => !article.isFeatured);

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
        Besides the latest news and design trends, on TechBehemoths you will find important information about the IT industry in every country and city listed on our website. Tips and hints how to find the best matching company for your future project.
      </p>

      {/* Blog grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {regularArticles.map(article => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <nav className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="font-medium bg-primary text-white hover:bg-primary/90">
            1
          </Button>
          <Button variant="outline" size="sm" className="font-medium">
            2
          </Button>
          <Button variant="outline" size="sm" className="font-medium">
            3
          </Button>
          <Button variant="outline" size="sm" className="font-medium">
            4
          </Button>
          <span className="mx-2">...</span>
          <Button variant="outline" size="sm" className="font-medium">
            31
          </Button>
          <Button variant="outline" size="sm" className="font-medium">
            32
          </Button>
          <Button variant="outline" size="sm" className="font-medium">
            Next
          </Button>
        </nav>
      </div>
    </div>
  );
}
