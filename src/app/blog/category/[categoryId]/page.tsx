import { Metadata } from "next";
import { BlogPage } from "@/components/blog/BlogPage";
import { blogCategories } from "@/data/blogData";

interface Props {
  params: {
    categoryId: string;
  };
}

export function generateMetadata({ params }: Props): Metadata {
  const category = blogCategories.find(c => c.id === params.categoryId);
  const categoryName = category ? category.name : "Category";

  return {
    title: `${categoryName} - TechBehemoths Blog`,
    description: `Browse the latest ${categoryName.toLowerCase()} articles and insights from the tech industry.`,
  };
}

export function generateStaticParams() {
  return blogCategories.map(category => ({
    categoryId: category.id,
  }));
}

export default function CategoryPage({ params }: Props) {
  const { categoryId } = params;

  return <BlogPage category={categoryId} />;
}
