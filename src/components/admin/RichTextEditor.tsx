'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Link,
  Unlink,
  Type,
  ExternalLink,
  X,
  Check,
} from 'lucide-react';

export interface RichTextLink {
  url: string;
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface RichTextContent {
  text: string;
  links: RichTextLink[];
}

interface RichTextEditorProps {
  value: RichTextContent;
  onChange: (content: RichTextContent) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
  className = "",
  minHeight = "100px"
}: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedRange, setSelectedRange] = useState<{start: number, end: number} | null>(null);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number>(-1);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 处理文本选择
  const handleTextSelection = useCallback(() => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    if (start !== end) {
      setSelectedRange({ start, end });
      const selectedText = value.text.substring(start, end);
      setLinkText(selectedText);
    } else {
      setSelectedRange(null);
      setLinkText('');
    }
  }, [value.text]);

  // 打开链接对话框
  const handleAddLink = () => {
    if (!selectedRange || selectedRange.start === selectedRange.end) {
      alert('Please select some text first to add a link.');
      return;
    }
    
    setShowLinkDialog(true);
    setIsEditingLink(false);
    setLinkUrl('https://');
  };

  // 编辑现有链接
  const handleEditLink = (linkIndex: number) => {
    const link = value.links[linkIndex];
    if (link) {
      setLinkUrl(link.url);
      setLinkText(link.text);
      setSelectedRange({ start: link.startIndex, end: link.endIndex });
      setEditingLinkIndex(linkIndex);
      setIsEditingLink(true);
      setShowLinkDialog(true);
    }
  };

  // 删除链接
  const handleRemoveLink = (linkIndex: number) => {
    const newLinks = value.links.filter((_, index) => index !== linkIndex);
    onChange({
      ...value,
      links: newLinks
    });
  };

  // 保存链接
  const handleSaveLink = () => {
    if (!linkUrl || !linkText || !selectedRange) return;

    const newLink: RichTextLink = {
      url: linkUrl,
      text: linkText,
      startIndex: selectedRange.start,
      endIndex: selectedRange.end
    };

    if (isEditingLink) {
      // 编辑现有链接
      const newLinks = [...value.links];
      newLinks[editingLinkIndex] = newLink;
      
      // 更新文本内容
      const newText = value.text.substring(0, selectedRange.start) + 
                     linkText + 
                     value.text.substring(selectedRange.end);
      
      onChange({
        text: newText,
        links: newLinks
      });
    } else {
      // 添加新链接
      // 更新文本内容
      const newText = value.text.substring(0, selectedRange.start) + 
                     linkText + 
                     value.text.substring(selectedRange.end);
      
      // 调整其他链接的位置
      const adjustedLinks = value.links.map(link => {
        if (link.startIndex > selectedRange.start) {
          const diff = linkText.length - (selectedRange.end - selectedRange.start);
          return {
            ...link,
            startIndex: link.startIndex + diff,
            endIndex: link.endIndex + diff
          };
        }
        return link;
      });

      // 更新新链接的结束位置
      newLink.endIndex = newLink.startIndex + linkText.length;

      onChange({
        text: newText,
        links: [...adjustedLinks, newLink]
      });
    }

    // 重置状态
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
    setSelectedRange(null);
    setIsEditingLink(false);
    setEditingLinkIndex(-1);
  };

  // 处理文本变化
  const handleTextChange = (newText: string) => {
    // 简单的文本更新，保持现有链接（在实际应用中可能需要更复杂的逻辑）
    onChange({
      text: newText,
      links: value.links
    });
  };

  // 渲染带链接的文本预览
  const renderTextWithLinks = () => {
    if (!value.text) return null;

    const parts = [];
    let currentIndex = 0;

    // 按位置排序链接
    const sortedLinks = [...value.links].sort((a, b) => a.startIndex - b.startIndex);

    sortedLinks.forEach((link, linkIndex) => {
      // 添加链接前的文本
      if (currentIndex < link.startIndex) {
        parts.push(
          <span key={`text-${currentIndex}`}>
            {value.text.substring(currentIndex, link.startIndex)}
          </span>
        );
      }

      // 添加链接
      parts.push(
        <span 
          key={`link-${linkIndex}`}
          className="relative group inline-flex items-center"
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
            onClick={(e) => e.preventDefault()} // 防止在编辑模式下跳转
          >
            {link.text}
          </a>
          <div className="hidden group-hover:flex absolute -top-8 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
            <button
              onClick={() => handleEditLink(linkIndex)}
              className="hover:text-blue-300 mr-2"
              title="Edit link"
            >
              Edit
            </button>
            <button
              onClick={() => handleRemoveLink(linkIndex)}
              className="hover:text-red-300"
              title="Remove link"
            >
              Remove
            </button>
          </div>
        </span>
      );

      currentIndex = link.endIndex;
    });

    // 添加剩余文本
    if (currentIndex < value.text.length) {
      parts.push(
        <span key={`text-${currentIndex}`}>
          {value.text.substring(currentIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className={`relative ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center gap-2 p-2 border border-gray-300 border-b-0 rounded-t-md bg-gray-50">
        <button
          onClick={handleAddLink}
          disabled={!selectedRange || selectedRange.start === selectedRange.end}
          className="flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Add Link"
        >
          <Link size={14} />
          Link
        </button>
        
        {value.links.length > 0 && (
          <span className="text-xs text-gray-500">
            {value.links.length} link{value.links.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* 文本编辑区域 */}
      <textarea
        ref={textareaRef}
        value={value.text}
        onChange={(e) => handleTextChange(e.target.value)}
        onSelect={handleTextSelection}
        onClick={handleTextSelection}
        onKeyUp={handleTextSelection}
        placeholder={placeholder}
        className={`w-full border border-gray-300 border-t-0 rounded-b-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary resize-vertical`}
        style={{ minHeight }}
      />

      {/* 链接预览（如果有链接） */}
      {value.links.length > 0 && (
        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-2">Preview with links:</div>
          <div className="text-sm leading-relaxed">
            {renderTextWithLinks()}
          </div>
        </div>
      )}

      {/* 链接对话框 */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {isEditingLink ? 'Edit Link' : 'Add Link'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl('');
                  setLinkText('');
                  setSelectedRange(null);
                  setIsEditingLink(false);
                  setEditingLinkIndex(-1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLink}
                disabled={!linkUrl || !linkText}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} />
                {isEditingLink ? 'Update' : 'Add'} Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}