"use client";

import React from "react";
import { X, Eye, Plus } from "lucide-react";
import { BlogEditModalProps } from "./types";
import { useBlogEditForm } from "./hooks/useBlogEditForm";
import { ContentBlockRenderer } from "./components/ContentBlockRenderer";
import { BlogSettings } from "./components/BlogSettings";
import { BlogModalFooter } from "./components/BlogModalFooter";
import { contentTypes, categories } from "./constants";
import {
  calculateReadTime,
  extractExcerpt,
} from "@/lib/firebase/services/blog";

export default function BlogEditModalRefactored({
  isOpen,
  onClose,
  blog,
  isCreating,
  onSave,
}: BlogEditModalProps) {
  const {
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
  } = useBlogEditForm(blog, isCreating);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Calculate read time and excerpt
      const readTime = calculateReadTime(formData.content);
      const excerpt = formData.excerpt || extractExcerpt(formData.content);

      const blogData = {
        ...formData,
        readTime,
        excerpt,
        updatedAt: new Date().toISOString(),
      };

      await onSave(blogData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setSaving(false);
    }
  };

  const renderContentBlock = (block: any) => (
    <ContentBlockRenderer
      block={block}
      updateContentBlock={updateContentBlock}
      handleImageUpload={handleImageUpload}
    />
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isCreating ? "Create New Blog Post" : "Edit Blog Post"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                previewMode
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === "content"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === "settings"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          {activeTab === "content" && (
            <div>
              {/* Content Blocks */}
              <div className="space-y-4">
                {formData.content.map((block, index) => (
                  <div key={block.id} className="relative">
                    {renderContentBlock(block)}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <button
                        onClick={() => moveContentBlock(block.id, "up")}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveContentBlock(block.id, "down")}
                        disabled={index === formData.content.length - 1}
                        className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeContentBlock(block.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Content Block */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Add Content Block
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {contentTypes.map((contentType) => (
                    <button
                      key={contentType.type}
                      onClick={() => addContentBlock(contentType.type)}
                      className="flex items-center gap-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                    >
                      <contentType.icon size={16} />
                      {contentType.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <BlogSettings
              formData={formData}
              handleInputChange={handleInputChange}
              categories={categories}
            />
          )}
        </div>

        {/* Footer */}
        <BlogModalFooter
          formData={formData}
          saving={saving}
          saveSuccess={saveSuccess}
          onClose={onClose}
          onSave={handleSave}
          calculateReadTime={calculateReadTime}
        />
      </div>
    </div>
  );
}
