"use client";

import { useState, useEffect } from "react";
import { Blog } from "@/lib/firebase/services/blog";
import { generateId } from "../utils/generateId";

export function useBlogEditForm(blog: Blog | null, isCreating: boolean) {
  const [formData, setFormData] = useState<Blog>({
    title: "",
    slug: "",
    content: [],
    excerpt: "",
    category: "",
    tags: [],
    author: "",
    publishedAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString().split("T")[0],
    image: "",
    readTime: 0,
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    views: 0,
    isFeatured: false,
    seoKeywords: [],
  });

  const [activeTab, setActiveTab] = useState<"content" | "settings">("content");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData(blog);
    } else if (isCreating) {
      setFormData({
        title: "",
        slug: "",
        content: [],
        excerpt: "",
        category: "",
        tags: [],
        author: "",
        publishedAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString().split("T")[0],
        image: "",
        readTime: 0,
        status: "draft",
        metaTitle: "",
        metaDescription: "",
        views: 0,
        isFeatured: false,
        seoKeywords: [],
      });
    }
  }, [blog, isCreating]);

  const handleInputChange = (field: keyof Blog, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addContentBlock = (type: Blog["content"][0]["type"]) => {
    const newBlock: Blog["content"][0] = {
      id: generateId(),
      type,
      content: "",
      level: type === "heading" ? 2 : undefined,
      language: type === "code" ? "javascript" : undefined,
      listItems: type === "list" ? [""] : undefined,
    } as Blog["content"][0];

    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, newBlock],
    }));
  };

  const updateContentBlock = (
    id: string,
    updates: Partial<Blog["content"][0]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    }));
  };

  const removeContentBlock = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((block) => block.id !== id),
    }));
  };

  const moveContentBlock = (id: string, direction: "up" | "down") => {
    setFormData((prev) => {
      const content = [...prev.content];
      const index = content.findIndex((block) => block.id === id);

      if (direction === "up" && index > 0) {
        [content[index], content[index - 1]] = [
          content[index - 1],
          content[index],
        ];
      } else if (direction === "down" && index < content.length - 1) {
        [content[index], content[index + 1]] = [
          content[index + 1],
          content[index],
        ];
      }

      return { ...prev, content };
    });
  };

  const handleImageUpload = (
    blockId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateContentBlock(blockId, {
        imageUrl: reader.result as string,
        alt: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  return {
    formData,
    setFormData,
    activeTab,
    setActiveTab,
    saving,
    setSaving,
    saveSuccess,
    setSaveSuccess,
    previewMode,
    setPreviewMode,
    handleInputChange,
    addContentBlock,
    updateContentBlock,
    removeContentBlock,
    moveContentBlock,
    handleImageUpload,
  };
}
