import { Metadata } from "next";
import { BlogPage } from "@/components/blog/BlogPage";

export const metadata: Metadata = {
  title: "Latest News in the Tech World - TechBehemoths Clone",
  description: "Explore the latest news, announcements, and other useful articles in the tech world. Stay up to date with the newest stories in the ever-changing IT industry!",
};

export default function BlogPageRoute() {
  return <BlogPage />;
}
