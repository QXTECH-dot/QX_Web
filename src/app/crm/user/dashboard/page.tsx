"use client";

import React from 'react';
import {
  Building2,
  Calendar,
  MessageSquare,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Sidebar from "@/components/crm/shared/layout/Sidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Welcome back, Username</h1>
            <p className="text-gray-600">Here's what's happening with your account today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#E4BF2D]/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#E4BF2D]" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-600">Following Companies</h3>
                  <p className="text-2xl font-semibold">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#E4BF2D]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#E4BF2D]" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-600">Upcoming Events</h3>
                  <p className="text-2xl font-semibold">3</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#E4BF2D]/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-[#E4BF2D]" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-600">Unread Messages</h3>
                  <p className="text-2xl font-semibold">5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#E4BF2D]/10 rounded-full flex items-center justify-center mt-1">
                      <Clock className="w-4 h-4 text-[#E4BF2D]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Profile Updated</h3>
                      <p className="text-sm text-gray-600">Updated company description and services</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#E4BF2D]/10 rounded-full flex items-center justify-center mt-1">
                      <Calendar className="w-4 h-4 text-[#E4BF2D]" />
                    </div>
                    <div>
                      <h3 className="font-medium">New Event Created</h3>
                      <p className="text-sm text-gray-600">Tech Conference 2024</p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Companies */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-6">Recommended Companies</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Tech Innovation Ltd</h3>
                      <p className="text-sm text-gray-600">Information Technology</p>
                    </div>
                    <span className="text-xs text-[#E4BF2D]">95% Match</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Green Tech Solutions</h3>
                      <p className="text-sm text-gray-600">Environmental Technology</p>
                    </div>
                    <span className="text-xs text-[#E4BF2D]">88% Match</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Future Finance Tech</h3>
                      <p className="text-sm text-gray-600">Financial Services</p>
                    </div>
                    <span className="text-xs text-[#E4BF2D]">82% Match</span>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 text-sm text-[#E4BF2D] mt-4 hover:text-[#c7a625]">
                    View All Recommendations
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 