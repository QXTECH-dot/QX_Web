"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { companiesData } from '@/data/companiesData';
import { Search, Building, MapPin, Plus, Edit, Eye, Trash } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminCompaniesPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Companies Management</h1>
          <button className="bg-qxnet hover:bg-qxnet-600 text-black font-medium py-2 px-4 rounded-md transition-colors flex items-center">
            <Plus className="h-5 w-5 mr-1" />
            Add New Company
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
                placeholder="Search companies..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent">
                <option value="">All Industries</option>
                <option value="finance">Finance</option>
                <option value="construction">Construction</option>
                <option value="accounting">Accounting</option>
                <option value="education">Education</option>
                <option value="it">IT & Technology</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent">
                <option value="">All Locations</option>
                <option value="nsw">New South Wales</option>
                <option value="vic">Victoria</option>
                <option value="qld">Queensland</option>
                <option value="act">Australian Capital Territory</option>
              </select>
            </div>
          </div>
        </div>

        {/* Companies table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Size
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companiesData.slice(0, 10).map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 relative flex-shrink-0 mr-3">
                          <Image
                            src={company.logo}
                            alt={company.name}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{company.name}</div>
                          {company.verified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {company.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1 text-gray-400" />
                        {company.industry || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.teamSize || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/company/${company.id}`}
                        className="inline-flex bg-blue-100 hover:bg-blue-200 text-blue-600 p-1.5 rounded transition-colors"
                        target="_blank"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
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
              Showing <span className="font-medium">10</span> of <span className="font-medium">{companiesData.length}</span> companies
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
