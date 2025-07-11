'use client';

import React from 'react';
import {
  Building2,
  Users,
  UserCheck,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  // Mock statistics data
  const stats = [
    {
      name: 'Total Companies',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: Building2,
      color: 'blue',
    },
    {
      name: 'Active Users',
      value: '1,924',
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'green',
    },
    {
      name: 'Pending Approvals',
      value: '47',
      change: '-23%',
      changeType: 'decrease',
      icon: AlertCircle,
      color: 'yellow',
    },
    {
      name: 'Verified Companies',
      value: '2,134',
      change: '+15%',
      changeType: 'increase',
      icon: UserCheck,
      color: 'purple',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'company_created',
      message: 'New company "Tech Solutions Ltd" was created',
      timestamp: '2 hours ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'company_approved',
      message: 'Company "Green Energy Co" was approved',
      timestamp: '4 hours ago',
      status: 'approved',
    },
    {
      id: 3,
      type: 'user_registered',
      message: 'New user john.doe@example.com registered',
      timestamp: '6 hours ago',
      status: 'active',
    },
    {
      id: 4,
      type: 'company_updated',
      message: 'Company "Digital Marketing Pro" updated their profile',
      timestamp: '8 hours ago',
      status: 'updated',
    },
  ];

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'text-primary bg-primary/10',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-primary bg-primary/10',
      purple: 'text-purple-600 bg-purple-100',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'company_created':
        return <Building2 className="h-4 w-4 text-primary" />;
      case 'company_approved':
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'user_registered':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'company_updated':
        return <Eye className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      updated: 'bg-orange-100 text-orange-800',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening in your system today.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                            activity.status
                          )}`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-sm text-primary hover:text-primary/80 font-medium">
                  View all activities →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-medium text-gray-900">Add New Company</span>
                  </div>
                  <span className="text-primary">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Review Pending Approvals</span>
                  </div>
                  <span className="text-primary">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Manage Users</span>
                  </div>
                  <span className="text-primary">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Generate Report</span>
                  </div>
                  <span className="text-primary">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
                <h4 className="text-sm font-medium text-gray-900">Database</h4>
                <p className="text-xs text-gray-500 mt-1">Operational</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
                <h4 className="text-sm font-medium text-gray-900">API Services</h4>
                <p className="text-xs text-gray-500 mt-1">Operational</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
                <h4 className="text-sm font-medium text-gray-900">Email Service</h4>
                <p className="text-xs text-gray-500 mt-1">Degraded Performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}