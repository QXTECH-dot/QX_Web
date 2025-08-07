import { Type, AlignLeft, Image, Quote, List, Code, Minus } from "lucide-react";

export const contentTypes = [
  { type: "heading", label: "Heading", icon: Type },
  { type: "paragraph", label: "Paragraph", icon: AlignLeft },
  { type: "image", label: "Image", icon: Image },
  { type: "quote", label: "Quote", icon: Quote },
  { type: "list", label: "List", icon: List },
  { type: "code", label: "Code", icon: Code },
  { type: "divider", label: "Divider", icon: Minus },
] as const;

export const categories = [
  "technology",
  "construction",
  "healthcare",
  "finance",
  "education",
  "retail",
  "manufacturing",
  "hospitality",
  "transport",
  "agriculture",
];

export const codeLanguages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "php",
  "ruby",
  "go",
  "rust",
  "swift",
  "kotlin",
  "html",
  "css",
  "sql",
  "bash",
  "json",
  "xml",
  "yaml",
  "markdown",
  "plaintext",
];

export const headingLevels = [
  { value: 1, label: "H1" },
  { value: 2, label: "H2" },
  { value: 3, label: "H3" },
  { value: 4, label: "H4" },
];

export const blogStatuses = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];
