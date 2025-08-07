import React from 'react';
import Link from 'next/link';

interface TableOfContentsItem {
  id: string;
  title: string;
}

interface BlogTableOfContentsProps {
  items: TableOfContentsItem[];
}

export function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-md mb-6">
      <h3 className="text-md font-medium mb-3">Contents</h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className="text-blue-600 hover:underline"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
