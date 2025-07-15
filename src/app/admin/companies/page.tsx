'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  RefreshCw,
} from 'lucide-react';
import CompanyEditModal from '@/components/admin/CompanyEditModal';
import AdminLayout from '@/components/admin/AdminLayout';

// Company interface matching the database structure
interface Company {
  id: string;
  name: string;
  trading_name?: string; // 交易名称字段
  slug?: string; // 添加slug字段
  abn: string;
  industry: string;
  status: 'active' | 'pending' | 'suspended';
  foundedYear: number;
  website?: string;
  email?: string;
  phone?: string;
  logo?: string;
  shortDescription?: string;
  fullDescription?: string;
  employeeCount: string;
  offices?: Office[];
  services?: Service[];
  history?: HistoryEvent[];
  createdAt: string;
  updatedAt: string;
}

interface Office {
  id?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  isHeadquarter: boolean;
}

interface Service {
  id?: string;
  title: string;
  description: string;
}

interface HistoryEvent {
  id?: string;
  year: string;
  event: string;
}


export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, page: 1, limit: 10 });
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const itemsPerPage = 10;

  // 加载公司数据
  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchTerm, filterStatus, filterIndustry]);

  const fetchCompanies = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterIndustry !== 'all' && { industry: filterIndustry })
      });

      const response = await fetch(`/api/admin/companies?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      const data = await response.json();
      setCompanies(data.data || []);
      setPagination(data.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 });
      
      // 记录刷新时间
      if (isRefresh) {
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // 手动刷新函数
  const handleRefresh = () => {
    fetchCompanies(true);
  };

  // Companies are already filtered and paginated by the API
  const paginatedCompanies = companies;
  const totalPages = pagination.totalPages;
  const startIndex = (pagination.page - 1) * pagination.limit;
  const filteredCompanies = companies; // For compatibility with existing code

  // Handle create new company
  const handleCreate = () => {
    setIsCreating(true);
    setSelectedCompany(null);
    setShowEditModal(true);
  };

  // Handle edit company
  const handleEdit = (company: Company) => {
    setIsCreating(false);
    setSelectedCompany(company);
    setShowEditModal(true);
  };

  // Handle delete company
  const handleDelete = (company: Company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!selectedCompany) return;

    try {
      const response = await fetch(`/api/admin/companies/${selectedCompany.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete company');
      }

      // 重新加载数据
      await fetchCompanies();
      setShowDeleteModal(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error('Error deleting company:', error);
      setError('Failed to delete company');
    }
  };

  // Handle save company
  const handleSave = async (companyData: any) => {
    try {
      const url = isCreating 
        ? '/api/admin/companies' 
        : `/api/admin/companies/${selectedCompany?.id}`;
      
      const method = isCreating ? 'POST' : 'PUT';

      console.log('Sending request to:', url);
      console.log('Method:', method);
      console.log('Data being sent:', companyData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to ${isCreating ? 'create' : 'update'} company`);
      }

      const result = await response.json();
      console.log('Success result:', result);

      // 检查是否有ID变化
      if (result.data && result.data.idChanged) {
        console.log(`Company ID changed from ${result.data.originalId} to ${result.data.updatedId}`);
        // 显示ID变化的通知
        setError(`Company ID was automatically updated from ${result.data.originalId} to ${result.data.updatedId} to follow naming standards.`);
      }

      // 重新加载数据
      await fetchCompanies();
      // 不关闭模态框，让用户继续编辑
      // setShowEditModal(false);
      // setSelectedCompany(null);
    } catch (error) {
      console.error('Error saving company:', error);
      setError(`Failed to ${isCreating ? 'create' : 'update'} company`);
    }
  };

  // Get unique industries for filter
  const industries = Array.from(new Set(
    companies.map(c => {
      // 处理industry可能是数组的情况
      if (Array.isArray(c.industry)) {
        return c.industry[0];
      }
      return c.industry;
    }).filter(Boolean) // 过滤掉空值
  ));

  // Debug: 检查是否有重复
  console.log('Industries array:', industries);
  console.log('Companies industries:', companies.map(c => c.industry));
  console.log('Company IDs:', companies.map(c => c.id));
  console.log('Unique company IDs:', Array.from(new Set(companies.map(c => c.id))));

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} />
            Pending
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Company Management</h1>
          <p className="text-gray-600 text-sm">Manage all companies in the system</p>
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
                  placeholder="Search by name, trading name, ABN, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              {searchTerm && (
                <p className="text-xs text-gray-500 mt-1">
                  Searching in company names, trading names, ABN numbers, and email addresses
                </p>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>

              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Industries</option>
                {industries.map((industry, index) => (
                  <option key={`filter-industry-${index}`} value={industry}>{industry}</option>
                ))}
              </select>

              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download size={16} />
                Export
              </button>

              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 font-medium shadow-md transition-all"
              >
                <Plus size={16} />
                Add Company
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        {lastRefresh && (
          <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Last refreshed: {lastRefresh.toLocaleString()}</span>
            </div>
            <span>Total: {pagination.total} companies</span>
          </div>
        )}

        {/* Companies Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-[8%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company ID
                  </th>
                  <th className="w-[27%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ABN
                  </th>
                  <th className="w-[18%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="w-[12%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="w-[10%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCompanies.map((company, index) => (
                  <tr key={`company-${index}-${company.id}`} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="text-sm font-mono text-gray-900 text-center">
                        {company.id.replace(/^COMP_0*/, '')}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0">
                          {company.logo ? (
                            <img className="h-8 w-8 rounded-full object-cover" src={company.logo} alt="" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <Building2 size={16} className="text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{company.name}</div>
                          {company.trading_name && (
                            <div className="text-xs text-blue-600 truncate">
                              Trading as: {company.trading_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-900 truncate">{company.abn}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-900 truncate">{company.industry}</div>
                    </td>
                    <td className="px-3 py-3">
                      {getStatusBadge(company.status)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-900">
                        {new Date(company.updatedAt).toLocaleDateString('en-AU', { 
                          day: '2-digit',
                          month: 'short'
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(company)}
                          className="text-primary hover:text-primary/80 p-1.5 hover:bg-primary/10 rounded"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(company)}
                          className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(startIndex + pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Go to:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          setCurrentPage(page);
                        }
                      }}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <span className="text-sm text-gray-700">of {totalPages}</span>
                  </div>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {(() => {
                      const maxPagesToShow = 5;
                      const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                      const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);
                      
                      const pages = [];
                      
                      // First page
                      if (adjustedStartPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => setCurrentPage(1)}
                            className="relative inline-flex items-center px-4 py-2 border bg-white border-gray-300 text-gray-500 hover:bg-gray-50 text-sm font-medium"
                          >
                            1
                          </button>
                        );
                        if (adjustedStartPage > 2) {
                          pages.push(
                            <span key="ellipsis1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          );
                        }
                      }
                      
                      // Current range
                      for (let page = adjustedStartPage; page <= endPage; page++) {
                        pages.push(
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-primary/10 border-primary text-primary'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      
                      // Last page
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span key="ellipsis2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          );
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="relative inline-flex items-center px-4 py-2 border bg-white border-gray-300 text-gray-500 hover:bg-gray-50 text-sm font-medium"
                          >
                            {totalPages}
                          </button>
                        );
                      }
                      
                      return pages;
                    })()}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Delete Company</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedCompany.name}</strong>? This action cannot be undone.
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
        <CompanyEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          company={selectedCompany}
          isCreating={isCreating}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
}