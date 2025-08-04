"use client";

import React from 'react';
import { Facebook, Twitter, Linkedin, Link2 } from 'lucide-react';

interface BlogSocialShareProps {
  title: string;
  url: string;
}

export function BlogSocialShare({ title, url }: BlogSocialShareProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    // In a real app, you would show a toast notification here
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-5 w-5 text-[#1877f2]" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5 text-[#1da1f2]" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5 text-[#0077b5]" />
      </a>
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Copy link"
      >
        <Link2 className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}
