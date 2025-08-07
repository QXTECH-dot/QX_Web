"use client";

import React from "react";
import Link from "next/link";
import { blogCategories } from "@/data/blogData";

interface BlogCategoryFilterProps {
  activeCategory?: string;
}

export function BlogCategoryFilter({ activeCategory = "all" }: BlogCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-200 pb-4">
      {blogCategories.map((category) => (
        <Link
          key={category.id}
          href={category.id === "all" ? "/blog" : `/blog/category/${category.id}`}
          className={`flex items-center px-4 py-2 ${
            activeCategory === category.id
              ? "bg-primary text-white font-medium"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          } rounded-md transition-colors`}
        >
          {category.name} <span className="ml-1 text-xs">{category.count}</span>
        </Link>
      ))}
      <div className="ml-auto">
        <button className="p-2 text-gray-500 hover:text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
