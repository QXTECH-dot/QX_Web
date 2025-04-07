import { Metadata } from "next";
import { BlogPostPage } from "@/components/blog/post/BlogPostPage";
import { blogArticles } from "@/data/blogData";

interface Props {
  params: {
    postId: string;
  };
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogArticles.find(article => article.id === params.postId);

  if (!post) {
    return {
      title: "Blog Post Not Found - TechBehemoths Clone",
      description: "The blog post you're looking for doesn't exist or has been removed.",
    };
  }

  return {
    title: `${post.title} - TechBehemoths Blog`,
    description: post.excerpt || `Read about ${post.title} in the TechBehemoths blog. Discover the latest insights in the tech industry.`,
  };
}

export function generateStaticParams() {
  return blogArticles.map(article => ({
    postId: article.id,
  }));
}

export default function PostPage({ params }: Props) {
  const { postId } = params;

  return <BlogPostPage postId={postId} />;
}
