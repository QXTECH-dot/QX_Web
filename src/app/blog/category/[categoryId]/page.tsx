import { Metadata } from "next";
import { BlogPage } from "@/components/blog/BlogPage";
import { blogCategories } from "@/data/blogData";

interface Props {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 服务器端获取分类博客数据
async function getCategoryBlogData(category: string, page: number = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog?category=${category}&page=${page}&limit=10`, {
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
    console.error('Error fetching category blogs:', error);
    return { articles: [], totalPages: 1, error: 'Failed to load blogs' };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryId } = await params;
  const category = blogCategories.find(c => c.id === categoryId);
  const categoryName = category ? category.name : "Category";

  return {
    title: `${categoryName} - QX Web Blog`,
    description: `Browse the latest ${categoryName.toLowerCase()} articles and insights from the tech industry.`,
  };
}

export function generateStaticParams() {
  return blogCategories.map(category => ({
    categoryId: category.id,
  }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categoryId } = await params;
  const searchParamsData = await searchParams;
  const page = Number(searchParamsData?.page) || 1;
  const blogData = await getCategoryBlogData(categoryId, page);

  return <BlogPage 
    category={categoryId} 
    initialBlogs={blogData.articles} 
    initialPagination={{ totalPages: blogData.totalPages }} 
  />;
}
