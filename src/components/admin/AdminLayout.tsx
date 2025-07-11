'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ChevronDown,
  Building,
  MapPin,
  Briefcase,
  History,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: 'Company Management',
    icon: <Building2 className="h-5 w-5" />,
    children: [
      {
        title: 'All Companies',
        href: '/admin/companies',
        icon: <Building className="h-4 w-4" />
      },
      {
        title: 'Add Company',
        href: '/admin/companies/create',
        icon: <Building className="h-4 w-4" />
      },
      {
        title: 'Company Offices',
        href: '/admin/companies/offices',
        icon: <MapPin className="h-4 w-4" />
      },
      {
        title: 'Company Services',
        href: '/admin/companies/services',
        icon: <Briefcase className="h-4 w-4" />
      },
      {
        title: 'Company History',
        href: '/admin/companies/history',
        icon: <History className="h-4 w-4" />
      },
      {
        title: 'Logo Management',
        href: '/admin/companies/logos',
        icon: <Image className="h-4 w-4" />
      }
    ]
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    title: 'System Settings',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

function MenuItem({ item, isExpanded }: { item: MenuItem; isExpanded: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href ? pathname === item.href : false;
  const hasActiveChild = hasChildren && item.children?.some(child => pathname === child.href);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
            hasActiveChild ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            {item.icon}
            {isExpanded && <span className="font-medium">{item.title}</span>}
          </div>
          {isExpanded && (
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </button>
        {isOpen && isExpanded && (
          <div className="bg-gray-50">
            {item.children?.map((child, index) => (
              <Link
                key={index}
                href={child.href || '#'}
                className={`flex items-center space-x-3 px-8 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  pathname === child.href ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600'
                }`}
              >
                {child.icon}
                <span>{child.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-700'
      }`}
    >
      {item.icon}
      {isExpanded && <span className="font-medium">{item.title}</span>}
    </Link>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarExpanded ? 'w-64' : 'w-16'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarExpanded && (
            <h1 className="text-xl font-bold text-gray-800">QX Admin</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-2"
          >
            {sidebarExpanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="py-4">
            {menuItems.map((item, index) => (
              <MenuItem key={index} item={item} isExpanded={sidebarExpanded} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <button className={`flex items-center space-x-3 w-full px-2 py-2 text-gray-600 hover:text-red-600 transition-colors ${
            !sidebarExpanded ? 'justify-center' : ''
          }`}>
            <LogOut className="h-5 w-5" />
            {sidebarExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">Administrator</span>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 