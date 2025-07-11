'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Edit2,
  Trash2,
  Building2,
  Mail,
  Phone,
  User,
  Calendar,
  Filter,
  UserCheck,
  AlertCircle,
  Save,
  X,
  Check,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
  company: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  // 来自user_company表的信息
  companyBindings?: {
    companyId: string;
    role: 'owner' | 'admin' | 'viewer';
    companyName?: string;
  }[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingCompanyId, setEditingCompanyId] = useState('');
  const [companySearchResult, setCompanySearchResult] = useState<{name: string} | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, filterRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterRole !== 'all' && { role: filterRole })
      });
      
      const response = await fetch(`/api/admin/users?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyIdChange = async (companyId: string) => {
    setEditingCompanyId(companyId);
    setCompanySearchResult(null);
    
    if (companyId && companyId.length > 0) {
      setLoadingCompany(true);
      try {
        const response = await fetch(`/api/admin/companies/${companyId}`);
        const data = await response.json();
        
        if (data.success) {
          setCompanySearchResult({ name: data.data.name });
        } else {
          setCompanySearchResult(null);
        }
      } catch (error) {
        console.error('Error fetching company:', error);
        setCompanySearchResult(null);
      } finally {
        setLoadingCompany(false);
      }
    }
  };

  const handleSaveCompanyBinding = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/company`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyId: editingCompanyId,
          role: 'owner'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEditingUserId(null);
        setEditingCompanyId('');
        setCompanySearchResult(null);
        await loadUsers();
      } else {
        setError(data.error || 'Failed to update company binding');
      }
    } catch (error) {
      console.error('Error updating company binding:', error);
      setError('Failed to update company binding');
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingCompanyId('');
    setCompanySearchResult(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <UserCheck size={12} className="mr-1" />
            Owner
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <User size={12} className="mr-1" />
            Admin
          </span>
        );
      case 'viewer':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <User size={12} className="mr-1" />
            Viewer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} className="mr-1" />
            No Company
          </span>
        );
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterRole === 'all') return matchesSearch;
    
    const hasRole = user.companyBindings?.some(binding => binding.role === filterRole);
    return matchesSearch && hasRole;
  });

  return (
    <AdminLayout>
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
          <p className="text-gray-600 text-sm">Manage user accounts and company bindings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Company Owners</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.companyBindings?.some(b => b.role === 'owner')).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">With Companies</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.companyBindings && u.companyBindings.length > 0).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Unbound</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => !u.companyBindings || u.companyBindings.length === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Roles</option>
                <option value="owner">Owners</option>
                <option value="admin">Admins</option>
                <option value="viewer">Viewers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div className="text-red-600 text-sm">{error}</div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
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
                    <th className="w-[25%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="w-[25%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company Binding
                    </th>
                    <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="w-[10%] px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No users found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-black text-sm font-medium">
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{user.phoneNumber}</div>
                          <div className="text-sm text-gray-500">{user.position}</div>
                        </td>
                        <td className="px-6 py-4">
                          {editingUserId === user.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editingCompanyId}
                                onChange={(e) => handleCompanyIdChange(e.target.value)}
                                placeholder="Enter Company ID"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                              />
                              {loadingCompany && (
                                <div className="text-xs text-gray-500">Searching...</div>
                              )}
                              {companySearchResult && (
                                <div className="flex items-center text-xs text-green-600">
                                  <Check size={12} className="mr-1" />
                                  {companySearchResult.name}
                                </div>
                              )}
                              {editingCompanyId && !loadingCompany && !companySearchResult && (
                                <div className="text-xs text-red-600">Company not found</div>
                              )}
                            </div>
                          ) : (
                            <div>
                              {user.companyBindings && user.companyBindings.length > 0 ? (
                                user.companyBindings.map((binding, index) => (
                                  <div key={index} className="text-sm">
                                    <div className="font-medium text-gray-900">{binding.companyName}</div>
                                    <div className="text-gray-500">ID: {binding.companyId}</div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm text-gray-500">No company bound</div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.companyBindings && user.companyBindings.length > 0 
                            ? getRoleBadge(user.companyBindings[0].role)
                            : getRoleBadge('none')
                          }
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {editingUserId === user.id ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleSaveCompanyBinding(user.id)}
                                disabled={!editingCompanyId || !companySearchResult}
                                className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded disabled:opacity-50"
                                title="Save"
                              >
                                <Save size={14} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingUserId(user.id)}
                              className="text-primary hover:text-primary/80 p-1 hover:bg-primary/10 rounded"
                              title="Edit Company Binding"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}