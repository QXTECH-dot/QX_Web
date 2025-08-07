import BlogEditModalRefactored from "./BlogEditModal/BlogEditModalRefactored";
import { BlogEditModalProps } from "./BlogEditModal/types";

export default function BlogEditModal(props: BlogEditModalProps) {
  return <BlogEditModalRefactored {...props} />;
}
