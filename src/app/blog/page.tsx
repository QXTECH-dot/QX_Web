import { Metadata } from "next";
import { BlogPage } from "@/components/blog/BlogPage";

export const metadata: Metadata = {
  title: "Latest News in the Tech World - QX Web",
  description:
    "Explore the latest news, announcements, and other useful articles in the tech world. Stay up to date with the newest stories in the ever-changing IT industry!",
};

async function getBlogs(
  page: number = 1,
  limit: number = 10,
  category?: string
) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && category !== "all" && { category }),
    });

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/blog?${queryParams}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return { blogs: [], pagination: { totalPages: 1 } };
    }

    const data = await response.json();
    return data.success
      ? {
          blogs: data.data || [],
          pagination: data.pagination || { totalPages: 1 },
        }
      : { blogs: [], pagination: { totalPages: 1 } };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { blogs: [], pagination: { totalPages: 1 } };
  }
}

interface BlogPageRouteProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BlogPageRoute({
  searchParams,
}: BlogPageRouteProps) {
  const page = Number(searchParams.page) || 1;
  const category = (searchParams.category as string) || "all";

  const { blogs, pagination } = await getBlogs(
    page,
    10,
    category !== "all" ? category : undefined
  );

  return <BlogPage initialBlogs={blogs} initialPagination={pagination} />;
}
