export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  readTime: number;
  status: 'draft' | 'published';
  metaTitle: string;
  metaDescription: string;
  views: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
} 