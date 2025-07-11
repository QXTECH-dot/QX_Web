'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Eye,
  Image,
  Type,
  AlignLeft,
  List,
  Quote,
  Code,
  Minus,
  Plus,
  Trash2,
  Upload,
  Tag,
  Calendar,
  User,
  Star,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Blog, BlogContent, generateSlug, calculateReadTime, extractExcerpt } from '@/lib/firebase/services/blog';

interface BlogEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
  isCreating: boolean;
  onSave: (blog: Blog) => Promise<void>;
}

const contentTypes = [
  { type: 'heading', label: 'Heading', icon: Type },
  { type: 'paragraph', label: 'Paragraph', icon: AlignLeft },
  { type: 'image', label: 'Image', icon: Image },
  { type: 'quote', label: 'Quote', icon: Quote },
  { type: 'list', label: 'List', icon: List },
  { type: 'code', label: 'Code', icon: Code },
  { type: 'divider', label: 'Divider', icon: Minus },
] as const;

const categories = [
  'technology',
  'construction',
  'healthcare',
  'finance',
  'education',
  'retail',
  'manufacturing',
  'hospitality',
  'transport',
  'agriculture',
];

export default function BlogEditModal({
  isOpen,
  onClose,
  blog,
  isCreating,
  onSave,
}: BlogEditModalProps) {
  const [formData, setFormData] = useState<Blog>({
    title: '',
    slug: '',
    content: [],
    excerpt: '',
    category: '',
    tags: [],
    author: '',
    publishedAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0],
    image: '',
    readTime: 0,
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    views: 0,
    isFeatured: false,
    seoKeywords: [],
  });

  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData(blog);
    } else if (isCreating) {
      setFormData({
        title: '',
        slug: '',
        content: [],
        excerpt: '',
        category: '',
        tags: [],
        author: '',
        publishedAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        image: '',
        readTime: 0,
        status: 'draft',
        metaTitle: '',
        metaDescription: '',
        views: 0,
        isFeatured: false,
        seoKeywords: [],
      });
    }
  }, [blog, isCreating]);

  const handleInputChange = (field: keyof Blog, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // Auto-generate meta title if not set
    if (field === 'title' && !formData.metaTitle) {
      setFormData(prev => ({ ...prev, metaTitle: value }));
    }
  };

  const addContentBlock = (type: BlogContent['type']) => {
    const newBlock: BlogContent = {
      id: Date.now().toString(),
      type,
      content: '',
      order: formData.content.length,
    };

    if (type === 'heading') {
      newBlock.level = 2;
    } else if (type === 'image') {
      newBlock.imageUrl = '';
      newBlock.alt = '';
      newBlock.caption = '';
    } else if (type === 'list') {
      newBlock.listItems = [''];
    } else if (type === 'code') {
      newBlock.language = 'javascript';
    }

    setFormData(prev => ({
      ...prev,
      content: [...prev.content, newBlock],
    }));
  };

  const updateContentBlock = (id: string, updates: Partial<BlogContent>) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.map(block =>
        block.id === id ? { ...block, ...updates } : block
      ),
    }));
  };

  const removeContentBlock = (id: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter(block => block.id !== id),
    }));
  };

  const moveContentBlock = (id: string, direction: 'up' | 'down') => {
    const blocks = [...formData.content];
    const index = blocks.findIndex(block => block.id === id);
    
    if (direction === 'up' && index > 0) {
      [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
    }

    // Update order
    blocks.forEach((block, i) => {
      block.order = i;
    });

    setFormData(prev => ({ ...prev, content: blocks }));
  };

  const handleImageUpload = (blockId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateContentBlock(blockId, {
          imageUrl: reader.result as string,
          alt: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

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
      console.error('Error saving blog:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderContentBlock = (block: BlogContent) => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <select
                value={block.level || 2}
                onChange={(e) => updateContentBlock(block.id, { level: Number(e.target.value) })}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
                <option value={4}>H4</option>
              </select>
            </div>
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
              placeholder="Enter heading text..."
              className="w-full text-lg font-semibold border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        );

      case 'paragraph':
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
            placeholder="Enter paragraph text..."
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary resize-vertical"
          />
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {block.imageUrl ? (
                <div className="relative">
                  <img
                    src={block.imageUrl}
                    alt={block.alt || ''}
                    className="max-w-full h-auto rounded-lg"
                  />
                  <button
                    onClick={() => updateContentBlock(block.id, { imageUrl: '', alt: '', caption: '' })}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
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
              value={block.alt || ''}
              onChange={(e) => updateContentBlock(block.id, { alt: e.target.value })}
              placeholder="Alt text..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="text"
              value={block.caption || ''}
              onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
              placeholder="Caption (optional)..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        );

      case 'quote':
        return (
          <div className="border-l-4 border-gray-300 pl-4">
            <textarea
              value={block.content}
              onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
              placeholder="Enter quote text..."
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary resize-vertical italic"
            />
          </div>
        );

      case 'list':
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
                    const newItems = (block.listItems || []).filter((_, i) => i !== index);
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
                const newItems = [...(block.listItems || []), ''];
                updateContentBlock(block.id, { listItems: newItems });
              }}
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <Plus size={16} />
              Add item
            </button>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-2">
            <select
              value={block.language || 'javascript'}
              onChange={(e) => updateContentBlock(block.id, { language: e.target.value })}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="sql">SQL</option>
              <option value="bash">Bash</option>
            </select>
            <textarea
              value={block.content}
              onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
              placeholder="Enter code..."
              rows={6}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary resize-vertical font-mono text-sm"
            />
          </div>
        );

      case 'divider':
        return (
          <div className="flex items-center justify-center py-4">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isCreating ? 'Create New Blog Post' : `Edit: ${formData.title}`}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Eye size={16} />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm font-medium text-green-800">
              Blog post saved successfully!
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings & SEO
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'content' && (
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter blog title..."
                  className="w-full text-lg font-semibold border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-slug"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Content Blocks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Content Blocks
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Add:</span>
                    {contentTypes.map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        onClick={() => addContentBlock(type)}
                        className="flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        title={`Add ${label}`}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.content.map((block, index) => (
                    <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {block.type}
                          </span>
                          {block.type === 'heading' && (
                            <span className="text-xs text-gray-500">
                              (H{block.level})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveContentBlock(block.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            onClick={() => moveContentBlock(block.id, 'down')}
                            disabled={index === formData.content.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button
                            onClick={() => removeContentBlock(block.id)}
                            className="p-1 text-red-600 hover:text-red-800 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {renderContentBlock(block)}
                    </div>
                  ))}
                </div>

                {formData.content.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="mb-4">No content blocks yet. Add your first block above.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Author name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Publish Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => handleInputChange('publishedAt', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the blog post..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                  placeholder="technology, innovation, trends"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* SEO Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                      placeholder="SEO title for search engines"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                      placeholder="SEO description for search engines"
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.seoKeywords.join(', ')}
                      onChange={(e) => handleInputChange('seoKeywords', e.target.value.split(',').map(keyword => keyword.trim()))}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Featured Post
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {formData.content.length} content blocks • ~{calculateReadTime(formData.content)} min read
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}