import { Metadata } from "next";
import { Suspense } from "react";
import { BlogPostPage } from "@/components/blog/post/BlogPostPage";

interface PostPageProps {
  params: {
    postId: string;
  };
}

async function getBlogPost(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getRelatedPosts(category: string, excludeSlug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog?category=${category}&limit=3`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    if (data.success) {
      return data.data.filter((article: any) => article.slug !== excludeSlug).slice(0, 3);
    }
    return [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.postId);

  if (!post) {
    return {
      title: "Blog Post Not Found | QX Web",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | QX Web Blog`,
    description: post.excerpt || post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.metaDescription,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getBlogPost(params.postId);
  const relatedPosts = post ? await getRelatedPosts(post.category, params.postId) : [];
  
  return (
    <Suspense fallback={<div className="container py-16 text-center">Loading blog post...</div>}>
      <BlogPostPage postId={params.postId} initialPost={post} initialRelatedPosts={relatedPosts} />
    </Suspense>
  );
}
