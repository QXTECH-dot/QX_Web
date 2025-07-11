'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Calendar,
  User,
  Tag,
  MoreVertical,
  TrendingUp,
  FileText,
  Clock,
  Star,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Blog, BlogStats } from '@/lib/firebase/services/blog';
import BlogEditModal from '@/components/admin/BlogEditModal';

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 10;

  // 模拟数据加载
  useEffect(() => {
    loadBlogs();
    loadStats();
  }, [currentPage, searchTerm, filterStatus, filterCategory]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterCategory !== 'all' && { category: filterCategory })
      });
      
      const response = await fetch(`/api/admin/blog?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.data);
      } else {
        console.error('Failed to load blogs:', data.error);
        setError(data.error);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/blog/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } else {
        // 如果统计API不存在，使用基本统计
        const publishedCount = blogs.filter(b => b.status === 'published').length;
        const draftCount = blogs.filter(b => b.status === 'draft').length;
        const totalViews = blogs.reduce((sum, b) => sum + b.views, 0);
        
        setStats({
          totalBlogs: blogs.length,
          publishedBlogs: publishedCount,
          draftBlogs: draftCount,
          totalViews,
          totalComments: 0,
          mostViewedBlog: blogs.sort((a, b) => b.views - a.views)[0]?.title || '',
          recentBlogs: []
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedBlog(null);
    setShowEditModal(true);
  };

  const handleEdit = (blog: Blog) => {
    setIsCreating(false);
    setSelectedBlog(blog);
    setShowEditModal(true);
  };

  const handleDelete = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedBlog) return;
    
    try {
      const response = await fetch(`/api/admin/blog/${selectedBlog.id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await loadBlogs();
        await loadStats();
        setShowDeleteModal(false);
        setSelectedBlog(null);
      } else {
        console.error('Failed to delete blog:', data.error);
        setError(data.error);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog');
    }
  };

  const handleSave = async (blogData: any) => {
    try {
      const url = isCreating ? '/api/admin/blog' : `/api/admin/blog/${selectedBlog?.id}`;
      const method = isCreating ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await loadBlogs();
        await loadStats();
        setShowEditModal(false);
        setSelectedBlog(null);
      } else {
        console.error('Failed to save blog:', data.error);
        setError(data.error);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      setError('Failed to save blog');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Eye size={12} className="mr-1" />
            Published
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FileText size={12} className="mr-1" />
            Draft
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock size={12} className="mr-1" />
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || blog.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(blogs.map(blog => blog.category)));

  return (
    <AdminLayout>
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Blog Management</h1>
          <p className="text-gray-600 text-sm">Create, edit, and manage your blog posts</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Blogs</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Published</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.publishedBlogs}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Drafts</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.draftBlogs}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 font-medium shadow-md transition-all"
              >
                <Plus size={16} />
                New Blog
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="text-red-600 text-sm">
                {error}
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Blogs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-[35%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="w-[12%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-[12%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="w-[6%] px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                        ? 'No blogs found matching your criteria'
                        : 'No blogs created yet'}
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-lg object-cover" src={blog.image} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                            {blog.isFeatured && (
                              <Star className="ml-2 h-4 w-4 text-yellow-400 fill-current" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{blog.excerpt.substring(0, 60)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{blog.category}</td>
                    <td className="px-6 py-4">{getStatusBadge(blog.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{blog.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{blog.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(blog.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-primary hover:text-primary/80 p-1 hover:bg-primary/10 rounded"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Delete Blog</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedBlog.title}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Create Modal */}
        {showEditModal && (
          <BlogEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            blog={selectedBlog}
            isCreating={isCreating}
            onSave={handleSave}
          />
        )}
      </div>
    </AdminLayout>
  );
}