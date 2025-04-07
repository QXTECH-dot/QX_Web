"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Plus, Mail, UserCheck, UserX, Edit, Trash } from 'lucide-react';
import Image from 'next/image';

// Mock user data
const mockUsers = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://ext.same-assets.com/1694792166/avatar1.png',
    lastLogin: '2025-03-28T10:32:45Z',
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Editor',
    status: 'Active',
    avatar: 'https://ext.same-assets.com/1694792166/avatar2.png',
    lastLogin: '2025-03-30T14:15:22Z',
  },
  {
    id: 'user-003',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'Viewer',
    status: 'Inactive',
    avatar: 'https://ext.same-assets.com/1694792166/avatar3.png',
    lastLogin: '2025-03-15T09:45:10Z',
  },
  {
    id: 'user-004',
    name: 'Jessica Taylor',
    email: 'j.taylor@example.com',
    role: 'Editor',
    status: 'Active',
    avatar: 'https://ext.same-assets.com/1694792166/avatar4.png',
    lastLogin: '2025-03-29T16:20:33Z',
  },
  {
    id: 'user-005',
    name: 'Robert Wilson',
    email: 'robert.w@example.com',
    role: 'Viewer',
    status: 'Active',
    avatar: 'https://ext.same-assets.com/1694792166/avatar5.png',
    lastLogin: '2025-03-25T11:05:18Z',
  },
  {
    id: 'user-006',
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://ext.same-assets.com/1694792166/avatar6.png',
    lastLogin: '2025-03-30T08:55:42Z',
  },
  {
    id: 'user-007',
    name: 'Daniel Brown',
    email: 'daniel.b@example.com',
    role: 'Viewer',
    status: 'Inactive',
    avatar: 'https://ext.same-assets.com/1694792166/avatar7.png',
    lastLogin: '2025-02-15T14:30:20Z',
  },
];

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <button className="bg-qxnet hover:bg-qxnet-600 text-black font-medium py-2 px-4 rounded-md transition-colors flex items-center">
            <Plus className="h-5 w-5 mr-1" />
            Add New User
          </button>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 relative flex-shrink-0 mr-3">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'Admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'Editor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.status === 'Active' ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-1 text-green-500" />
                            <span className="text-green-600 text-sm">Active</span>
                          </>
                        ) : (
                          <>
                            <UserX className="h-4 w-4 mr-1 text-red-500" />
                            <span className="text-red-600 text-sm">Inactive</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleString('en-AU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button className="inline-flex bg-yellow-100 hover:bg-yellow-200 text-yellow-600 p-1.5 rounded transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="inline-flex bg-red-100 hover:bg-red-200 text-red-600 p-1.5 rounded transition-colors">
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{mockUsers.length}</span> users
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-white px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                disabled
              >
                Previous
              </button>
              <button
                className="bg-qxnet-50 px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-qxnet-800 hover:bg-qxnet-100 transition-colors"
              >
                1
              </button>
              <button
                className="bg-white px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
