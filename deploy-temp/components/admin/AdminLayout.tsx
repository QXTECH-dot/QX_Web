"use client";

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  LineChart,
  Building
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <div className={`flex items-center ${!isSidebarOpen && 'justify-center w-full'}`}>
            <div className="w-8 h-8 bg-qxnet rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">QX</span>
            </div>
            {isSidebarOpen && (
              <span className="ml-2 font-bold">QX Net Admin</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className={`text-gray-400 hover:text-white ${!isSidebarOpen && 'hidden'}`}
          >
            <X size={20} />
          </button>
          <button
            onClick={toggleSidebar}
            className={`text-gray-400 hover:text-white ${isSidebarOpen && 'hidden'} w-full flex justify-center`}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col justify-between">
          <nav className="px-2 space-y-1">
            <Link
              href="/admin"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
            >
              <Home className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Dashboard</span>}
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
            >
              <Calendar className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Events</span>}
            </Link>
            <Link
              href="/admin/companies"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
            >
              <Building className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Companies</span>}
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
            >
              <Users className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Users</span>}
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
            >
              <LineChart className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Analytics</span>}
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
            >
              <Settings className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Settings</span>}
            </Link>
          </nav>

          <div className="px-2">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Back to Site</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
