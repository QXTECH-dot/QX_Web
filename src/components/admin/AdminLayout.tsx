'use client';

import React, { useEffect } from 'react';
import {
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Home,
  FileText,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useAdminAuth } from '@/lib/admin/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  // const { user, loading, logout } = useAdminAuth();

  // 临时禁用auth检查
  const user = { email: 'admin@qxnet.com' };
  const loading = false;
  const logout = () => console.log('Logout clicked');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // 会被重定向到登录页面
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Companies', href: '/admin/companies', icon: Building2 },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-black" />
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">QX Net</div>
                <div className="text-xs text-primary font-medium">Admin Portal</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${active
                      ? 'bg-primary text-black shadow-md'
                      : 'text-gray-300 hover:text-primary hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-gray-800">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-black text-sm font-bold">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-primary hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}