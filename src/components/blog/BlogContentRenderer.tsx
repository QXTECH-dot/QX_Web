'use client';

import React from 'react';
import { BlogContent, RichTextContent, RichTextLink } from '@/lib/firebase/services/blog';
import { Code, Quote, ExternalLink } from 'lucide-react';

interface BlogContentRendererProps {
  content: BlogContent[];
  className?: string;
}

export function BlogContentRenderer({ content, className = '' }: BlogContentRendererProps) {
  // Helper function to render rich text with links
  const renderRichText = (richContent: RichTextContent, baseClassName: string = '') => {
    if (!richContent.links || richContent.links.length === 0) {
      return <span className={baseClassName}>{richContent.text}</span>;
    }

    const parts = [];
    let currentIndex = 0;

    // Sort links by start index
    const sortedLinks = [...richContent.links].sort((a, b) => a.startIndex - b.startIndex);

    sortedLinks.forEach((link, linkIndex) => {
      // Add text before the link
      if (currentIndex < link.startIndex) {
        parts.push(
          <span key={`text-${currentIndex}`} className={baseClassName}>
            {richContent.text.substring(currentIndex, link.startIndex)}
          </span>
        );
      }

      // Add the link
      parts.push(
        <a
          key={`link-${linkIndex}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline underline-offset-2 decoration-2 inline-flex items-center gap-1 transition-colors"
        >
          {link.text}
          <ExternalLink size={14} className="opacity-70" />
        </a>
      );

      currentIndex = link.endIndex;
    });

    // Add remaining text
    if (currentIndex < richContent.text.length) {
      parts.push(
        <span key={`text-${currentIndex}`} className={baseClassName}>
          {richContent.text.substring(currentIndex)}
        </span>
      );
    }

    return <>{parts}</>;
  };

  const renderContent = (block: BlogContent) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: 'text-4xl font-bold text-gray-900 mb-8 mt-12',
          2: 'text-3xl font-bold text-gray-900 mb-6 mt-10',
          3: 'text-2xl font-bold text-gray-900 mb-4 mt-8',
          4: 'text-xl font-bold text-gray-900 mb-4 mt-6',
          5: 'text-lg font-bold text-gray-900 mb-3 mt-4',
          6: 'text-base font-bold text-gray-900 mb-3 mt-4',
        };
        
        return (
          <HeadingTag
            key={block.id}
            className={`${headingClasses[block.level as keyof typeof headingClasses]} scroll-mt-20`}
            id={block.content.toLowerCase().replace(/\s+/g, '-')}
          >
            {block.content}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p key={block.id} className="text-gray-700 leading-relaxed mb-6 text-lg">
            {block.richContent ? 
              renderRichText(block.richContent) : 
              block.content
            }
          </p>
        );

      case 'image':
        return (
          <div key={block.id} className="my-8">
            <figure className="space-y-4">
              <img
                src={block.imageUrl}
                alt={block.alt || ''}
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
              />
              {block.caption && (
                <figcaption className="text-sm text-gray-600 text-center italic">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          </div>
        );

      case 'quote':
        return (
          <blockquote key={block.id} className="my-8 border-l-4 border-primary pl-6 py-4 bg-gray-50 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Quote className="text-primary mt-1 flex-shrink-0" size={20} />
              <p className="text-gray-700 text-lg italic leading-relaxed">
                {block.richContent ? 
                  renderRichText(block.richContent, "italic") : 
                  block.content
                }
              </p>
            </div>
          </blockquote>
        );

      case 'list':
        return (
          <div key={block.id} className="my-6">
            <ul className="space-y-2 text-gray-700 text-lg">
              {block.listItems?.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-2 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'code':
        return (
          <div key={block.id} className="my-8">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <Code size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300 capitalize">
                    {block.language || 'Code'}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  Code
                </span>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-300 font-mono leading-relaxed">
                  {block.content}
                </code>
              </pre>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div key={block.id} className="my-12 flex items-center justify-center">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="mx-4 w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {content
        .sort((a, b) => a.order - b.order)
        .map(renderContent)}
    </div>
  );
}