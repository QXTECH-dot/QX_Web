'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Activity,
  Globe,
  MapPin,
  DollarSign,
  Percent
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('companies');

  // Mock data - replace with actual data fetching
  const stats = {
    totalCompanies: 1247,
    totalUsers: 3456,
    activeUsers: 892,
    newCompaniesThisMonth: 47,
    newUsersThisMonth: 123,
    companyGrowthRate: 12.5,
    userGrowthRate: 8.3,
    averageSessionDuration: '4m 32s',
    bounceRate: 23.4,
    conversionRate: 3.2
  };

  const chartData = {
    companies: [
      { month: 'Jan', value: 1100 },
      { month: 'Feb', value: 1150 },
      { month: 'Mar', value: 1180 },
      { month: 'Apr', value: 1200 },
      { month: 'May', value: 1220 },
      { month: 'Jun', value: 1247 }
    ],
    users: [
      { month: 'Jan', value: 2800 },
      { month: 'Feb', value: 2950 },
      { month: 'Mar', value: 3100 },
      { month: 'Apr', value: 3250 },
      { month: 'May', value: 3350 },
      { month: 'Jun', value: 3456 }
    ]
  };

  const topStates = [
    { state: 'NSW', companies: 456, percentage: 36.6 },
    { state: 'VIC', companies: 324, percentage: 26.0 },
    { state: 'QLD', companies: 198, percentage: 15.9 },
    { state: 'WA', companies: 142, percentage: 11.4 },
    { state: 'SA', companies: 87, percentage: 7.0 },
    { state: 'Others', companies: 40, percentage: 3.2 }
  ];

  const topIndustries = [
    { industry: 'Technology', companies: 234, percentage: 18.8 },
    { industry: 'Healthcare', companies: 187, percentage: 15.0 },
    { industry: 'Finance', companies: 156, percentage: 12.5 },
    { industry: 'Manufacturing', companies: 143, percentage: 11.5 },
    { industry: 'Retail', companies: 128, percentage: 10.3 },
    { industry: 'Others', companies: 399, percentage: 32.0 }
  ];

  const recentActivity = [
    { type: 'company_registered', count: 23, change: '+12%' },
    { type: 'user_signup', count: 67, change: '+8%' },
    { type: 'profile_updated', count: 145, change: '+5%' },
    { type: 'logo_uploaded', count: 34, change: '+15%' }
  ];

  const getChangeIcon = (change: string) => {
    if (change.startsWith('+')) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (change.startsWith('-')) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) {
      return 'text-green-600';
    } else if (change.startsWith('-')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive platform insights and statistics</p>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCompanies.toLocaleString()}</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>+{stats.companyGrowthRate}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>+{stats.userGrowthRate}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total users
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <div className="text-xs text-muted-foreground">
                Visitor to registration
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Growth Trends</CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="companies">Companies</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Monthly growth over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {chartData[selectedMetric as keyof typeof chartData].map((item, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ 
                        height: `${(item.value / Math.max(...chartData[selectedMetric as keyof typeof chartData].map(d => d.value))) * 200}px` 
                      }}
                      title={`${item.month}: ${item.value}`}
                    />
                    <div className="text-xs text-gray-600">{item.month}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Activity breakdown for the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <div className="font-medium capitalize">
                          {activity.type.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.count} this month
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${getChangeColor(activity.change)}`}>
                      {getChangeIcon(activity.change)}
                      <span>{activity.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic and Industry Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top States */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Companies by State
              </CardTitle>
              <CardDescription>
                Geographic distribution of registered companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topStates.map((state, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">{state.state}</span>
                      </div>
                      <div>
                        <div className="font-medium">{state.state}</div>
                        <div className="text-sm text-gray-600">{state.companies} companies</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${state.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{state.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Industries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Companies by Industry
              </CardTitle>
              <CardDescription>
                Industry distribution of registered companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topIndustries.map((industry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-green-700">
                          {industry.industry.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{industry.industry}</div>
                        <div className="text-sm text-gray-600">{industry.companies} companies</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${industry.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{industry.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators for the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.averageSessionDuration}</div>
                <div className="text-sm text-gray-600">Average Session Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.bounceRate}%</div>
                <div className="text-sm text-gray-600">Bounce Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.newCompaniesThisMonth}</div>
                <div className="text-sm text-gray-600">New Companies This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.newUsersThisMonth}</div>
                <div className="text-sm text-gray-600">New Users This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 