import { Metadata } from "next";
import { BlogPageSSR } from "@/components/blog/BlogPageSSR";

export const metadata: Metadata = {
  title: "Latest News in the Tech World - TechBehemoths Clone",
  description: "Explore the latest news, announcements, and other useful articles in the tech world. Stay up to date with the newest stories in the ever-changing IT industry!",
};

// 服务器端获取博客数据
async function getBlogData(page: number = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog?page=${page}&limit=10`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return { articles: [], totalPages: 1, error: `HTTP ${response.status}` };
    }
    
    const data = await response.json();
    
    if (data.success) {
      return {
        articles: data.data || [],
        totalPages: data.pagination?.totalPages || 1,
        error: null
      };
    }
    
    return { articles: [], totalPages: 1, error: data.error || 'Failed to load blogs' };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { articles: [], totalPages: 1, error: 'Failed to load blogs' };
  }
}

interface BlogPageRouteProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPageRoute({ searchParams }: BlogPageRouteProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const blogData = await getBlogData(page);
  
  return <BlogPageSSR {...blogData} currentPage={page} />;
}
