"use client";

import React from "react";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  MessageSquare,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside className="w-64 bg-[#1a1a1a] text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[#E4BF2D]">Enterprise CRM</h1>
      </div>
      
      <nav className="px-4">
        <div className="space-y-2">
          <Link 
            href="/crm/user/dashboard" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              isActive('/crm/user/dashboard') 
                ? 'bg-[#E4BF2D] text-black' 
                : 'text-gray-400 hover:text-[#E4BF2D]'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="mt-8">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-4">Menu</p>
          <div className="space-y-2">
            <Link 
              href="/crm/user/company" 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                isActive('/crm/user/company') 
                  ? 'bg-[#E4BF2D] text-black' 
                  : 'text-gray-400 hover:text-[#E4BF2D]'
              }`}
            >
              <Building2 size={20} />
              <span>Company Management</span>
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-3 text-gray-400 hover:text-[#E4BF2D] px-4 py-2"
            >
              <Calendar size={20} />
              <span>Event Calendar</span>
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-3 text-gray-400 hover:text-[#E4BF2D] px-4 py-2"
            >
              <MessageSquare size={20} />
              <span>Messages</span>
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-3 text-gray-400 hover:text-[#E4BF2D] px-4 py-2"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
} 