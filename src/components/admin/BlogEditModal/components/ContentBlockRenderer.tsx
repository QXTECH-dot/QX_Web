"use client";

import React from "react";
import { X, ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import { RichTextContent } from "@/lib/firebase/services/blog";
import RichTextEditor from "../../RichTextEditor";
import { ContentBlockRendererProps } from "../types";
import { headingLevels, codeLanguages } from "../constants";

export function ContentBlockRenderer({
  block,
  updateContentBlock,
  handleImageUpload,
}: ContentBlockRendererProps) {
  const renderBlock = () => {
    switch (block.type) {
      case "heading":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <select
                value={block.level || 2}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    level: Number(e.target.value),
                  })
                }
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                {headingLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={block.content}
              onChange={(e) =>
                updateContentBlock(block.id, { content: e.target.value })
              }
              placeholder="Enter heading text..."
              className="w-full text-lg font-semibold border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        );

      case "paragraph":
        const paragraphContent: RichTextContent = block.richContent || {
          text: block.content || "",
          links: [],
        };

        return (
          <RichTextEditor
            value={paragraphContent}
            onChange={(content) =>
              updateContentBlock(block.id, {
                richContent: content,
                content: content.text, // Keep backward compatibility
              })
            }
            placeholder="Enter paragraph text..."
            minHeight="100px"
          />
        );

      case "image":
        return (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {block.imageUrl ? (
                <div className="relative">
                  <img
                    src={block.imageUrl}
                    alt={block.alt || ""}
                    className="max-w-full h-auto rounded-lg"
                  />
                  <button
                    onClick={() =>
                      updateContentBlock(block.id, {
                        imageUrl: "",
                        alt: "",
                        caption: "",
                      })
                    }
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(block.id, e)}
                        className="sr-only"
                      />
                      Upload Image
                    </label>
                  </div>
                </div>
              )}
            </div>
            <input
              type="text"
              value={block.alt || ""}
              onChange={(e) =>
                updateContentBlock(block.id, { alt: e.target.value })
              }
              placeholder="Alt text..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="text"
              value={block.caption || ""}
              onChange={(e) =>
                updateContentBlock(block.id, { caption: e.target.value })
              }
              placeholder="Caption (optional)..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        );

      case "quote":
        const quoteContent: RichTextContent = block.richContent || {
          text: block.content || "",
          links: [],
        };

        return (
          <div className="border-l-4 border-gray-300 pl-4">
            <RichTextEditor
              value={quoteContent}
              onChange={(content) =>
                updateContentBlock(block.id, {
                  richContent: content,
                  content: content.text, // Keep backward compatibility
                })
              }
              placeholder="Enter quote text..."
              minHeight="80px"
              className="italic"
            />
          </div>
        );

      case "list":
        return (
          <div className="space-y-2">
            {block.listItems?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(block.listItems || [])];
                    newItems[index] = e.target.value;
                    updateContentBlock(block.id, { listItems: newItems });
                  }}
                  placeholder={`List item ${index + 1}...`}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  onClick={() => {
                    const newItems = (block.listItems || []).filter(
                      (_, i) => i !== index
                    );
                    updateContentBlock(block.id, { listItems: newItems });
                  }}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newItems = [...(block.listItems || []), ""];
                updateContentBlock(block.id, { listItems: newItems });
              }}
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <Plus size={16} />
              Add item
            </button>
          </div>
        );

      case "code":
        return (
          <div className="space-y-2">
            <select
              value={block.language || "javascript"}
              onChange={(e) =>
                updateContentBlock(block.id, { language: e.target.value })
              }
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {codeLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <textarea
              value={block.content}
              onChange={(e) =>
                updateContentBlock(block.id, { content: e.target.value })
              }
              placeholder="Enter code..."
              rows={6}
              className="w-full font-mono text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
            />
          </div>
        );

      case "divider":
        return (
          <div className="border-t border-gray-300 my-4">
            <div className="text-center text-gray-500 text-sm">Divider</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateContentBlock(block.id, {})}
            className="text-gray-400 hover:text-gray-600 p-1"
            disabled={block.type === "divider"}
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={() => updateContentBlock(block.id, {})}
            className="text-gray-400 hover:text-gray-600 p-1"
            disabled={block.type === "divider"}
          >
            <ChevronDown size={16} />
          </button>
        </div>
        <button
          onClick={() => updateContentBlock(block.id, {})}
          className="text-red-600 hover:text-red-800 p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {renderBlock()}
    </div>
  );
}
