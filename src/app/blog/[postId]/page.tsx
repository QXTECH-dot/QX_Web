import { Metadata } from "next";
import { BlogPostPageSSR } from "@/components/blog/post/BlogPostPageSSR";
import { getBlogBySlug, getBlogs } from "@/lib/firebase/services/blog";

interface PostPageProps {
  params: Promise<{ postId: string }>;
}

async function getBlogPost(slug: string) {
  try {
    const blog = await getBlogBySlug(slug);
    return blog && blog.status === 'published' ? blog : null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getRelatedPosts(category: string, excludeSlug: string) {
  try {
    const result = await getBlogs({ 
      category: category,
      limit: 4,
      status: 'published'
    });
    
    const filtered = result.blogs.filter((article) => article.slug !== excludeSlug);
    return filtered.slice(0, 3);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await getBlogPost(postId);

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
  const { postId } = await params;
  const post = await getBlogPost(postId);
  const relatedPosts = post ? await getRelatedPosts(post.category, postId) : [];

  return (
    <BlogPostPageSSR 
      post={post} 
      relatedPosts={relatedPosts}
      postId={postId}
    />
  );
}
