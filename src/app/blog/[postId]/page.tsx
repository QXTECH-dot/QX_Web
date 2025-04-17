import { Metadata } from "next";
import { Suspense } from "react";
import { BlogPostPage } from "@/components/blog/post/BlogPostPage";
import { blogArticles } from "@/data/blogData";

interface PostPageProps {
  params: {
    postId: string;
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = blogArticles.find(article => article.id === params.postId);

  if (!post) {
    return {
      title: "Blog Post Not Found | QX Net",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | QX Net Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export function generateStaticParams() {
  return blogArticles.map(article => ({
    postId: article.id,
  }));
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <Suspense fallback={<div className="container py-16 text-center">Loading blog post...</div>}>
      <BlogPostPage postId={params.postId} />
    </Suspense>
  );
}
