"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  category: string;
}

export function BlogPagination({ currentPage, totalPages, category }: BlogPaginationProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const basePath = category === 'all' ? '/blog' : `/blog/category/${category}`;
    const url = newPage === 1 ? basePath : `${basePath}?page=${newPage}`;
    router.push(url);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center gap-1">
        {currentPage > 1 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="font-medium"
            onClick={() => handlePageChange(currentPage - 1)}
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
              onClick={() => handlePageChange(pageNum)}
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
              onClick={() => handlePageChange(totalPages)}
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
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        )}
      </nav>
    </div>
  );
}