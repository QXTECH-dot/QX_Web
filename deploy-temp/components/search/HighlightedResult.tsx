"use client";

import React from 'react';
import { stringSimilarity } from './FuzzySearch';

interface HighlightedTextProps {
  text: string;
  query: string;
  highlightClassName?: string;
}

export function HighlightedText({
  text,
  query,
  highlightClassName = "bg-yellow-100 text-black font-medium"
}: HighlightedTextProps) {
  // If no query or exact match, use simple highlighting
  if (!query || query.trim() === '') {
    return <span>{text}</span>;
  }

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();

  // For exact matches, highlight the substring
  const index = normalizedText.indexOf(normalizedQuery);
  if (index >= 0) {
    const before = text.substring(0, index);
    const match = text.substring(index, index + normalizedQuery.length);
    const after = text.substring(index + normalizedQuery.length);

    return (
      <span>
        {before}
        <span className={highlightClassName}>{match}</span>
        {after}
      </span>
    );
  }

  // For fuzzy matches, we'll try to highlight individual words
  // Split the text into words
  const words = text.split(/\s+/);
  const threshold = 0.7; // Similarity threshold for word matching

  return (
    <span>
      {words.map((word, i) => {
        const similarity = stringSimilarity(word.toLowerCase(), normalizedQuery);

        // If the word is similar enough to the query, highlight it
        if (similarity >= threshold) {
          return (
            <React.Fragment key={i}>
              <span className={highlightClassName}>{word}</span>
              {i < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        }

        // Otherwise, render the word normally
        return (
          <React.Fragment key={i}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </span>
  );
}

// Component to highlight a company name
export function HighlightedCompanyName({
  name,
  query
}: {
  name: string;
  query: string;
}) {
  return (
    <h3 className="font-bold text-lg flex items-center">
      <HighlightedText
        text={name}
        query={query}
        highlightClassName="bg-primary/10 text-primary font-bold px-1 rounded"
      />
    </h3>
  );
}

// Component to highlight company description
export function HighlightedDescription({
  description,
  query
}: {
  description: string;
  query: string;
}) {
  return (
    <p className="text-sm text-gray-700 my-2">
      <HighlightedText
        text={description}
        query={query}
        highlightClassName="bg-primary/10 text-primary font-medium"
      />
    </p>
  );
}
