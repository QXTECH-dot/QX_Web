import React from "react";
import { BlogCard } from "./BlogCard";
import { BlogCategoryFilter } from "./BlogCategoryFilter";
import { BlogPagination } from "./BlogPagination";
import { Zap } from "lucide-react";

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

interface BlogPageSSRProps {
  articles: BlogArticle[];
  totalPages: number;
  currentPage: number;
  error: string | null;
  category?: string;
}

export function BlogPageSSR({ 
  articles, 
  totalPages, 
  currentPage, 
  error,
  category = "all" 
}: BlogPageSSRProps) {
  // 服务器端渲染的错误处理
  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Blog, News and Useful Insights</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  // 找到特色文章（仅在显示所有分类时）
  const featuredArticle = category === "all" ? articles.find(article => article.isFeatured) : null;
  
  // 其他文章 - 如果有特色文章则排除它
  const regularArticles = featuredArticle 
    ? articles.filter(article => article.id !== featuredArticle.id)
    : articles;

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

      {/* 特色文章 - 服务器端渲染 */}
      {featuredArticle && category === "all" && (
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm font-semibold">Featured Post</span>
          </div>
          <BlogCard article={featuredArticle} featured={true} />
        </div>
      )}

      {/* 分类筛选器 */}
      <BlogCategoryFilter activeCategory={category} />

      {/* 分类描述 */}
      <p className="text-gray-600 mb-10">
        Besides the latest news and design trends, on TechBehemoths you will find important information about the IT industry in every country and city listed on our website. Tips and hints how to find the best matching company for your future project.
      </p>

      {/* 博客网格 - 服务器端渲染 */}
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

      {/* 分页组件 - 客户端交互 */}
      {totalPages > 1 && (
        <BlogPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          category={category}
        />
      )}
    </div>
  );
}