"use client";

import React, { useState } from 'react';
import { History, Users, Building2, Calendar, Star, Eye, UserPlus, UserMinus } from 'lucide-react';
import Sidebar from '@/components/crm/shared/layout/Sidebar';

interface Activity {
  id: string;
  type: 'follow' | 'unfollow' | 'view_company' | 'save_company' | 'unsave_company' | 'event_register';
  targetName: string;
  targetType: 'user' | 'company' | 'event';
  timestamp: string;
  details?: string;
}

export default function RecentActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'follow',
      targetName: 'Sarah Johnson',
      targetType: 'user',
      timestamp: '2024-03-22 14:30',
    },
    {
      id: '2',
      type: 'save_company',
      targetName: 'Tech Solutions Australia',
      targetType: 'company',
      timestamp: '2024-03-22 11:15',
    },
    {
      id: '3',
      type: 'event_register',
      targetName: 'Tech Innovation Summit 2024',
      targetType: 'event',
      timestamp: '2024-03-21 16:45',
      details: 'Virtual Event • April 15, 2024',
    },
    {
      id: '4',
      type: 'view_company',
      targetName: 'Green Energy New Zealand',
      targetType: 'company',
      timestamp: '2024-03-21 10:20',
    },
    {
      id: '5',
      type: 'unfollow',
      targetName: 'David Chen',
      targetType: 'user',
      timestamp: '2024-03-20 15:30',
    },
    {
      id: '6',
      type: 'unsave_company',
      targetName: 'Digital Marketing Pro',
      targetType: 'company',
      timestamp: '2024-03-20 09:45',
    },
    {
      id: '7',
      type: 'follow',
      targetName: 'Emma Wilson',
      targetType: 'user',
      timestamp: '2024-03-19 17:20',
    },
    {
      id: '8',
      type: 'event_register',
      targetName: 'Networking Breakfast',
      targetType: 'event',
      timestamp: '2024-03-19 11:00',
      details: 'Sydney CBD • March 25, 2024',
    }
  ]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'follow':
        return <UserPlus className="text-[#E4BF2D]" size={16} />;
      case 'unfollow':
        return <UserMinus className="text-red-500" size={16} />;
      case 'view_company':
        return <Eye className="text-blue-500" size={16} />;
      case 'save_company':
        return <Star className="text-[#E4BF2D]" size={16} />;
      case 'unsave_company':
        return <Star className="text-gray-400" size={16} />;
      case 'event_register':
        return <Calendar className="text-green-500" size={16} />;
      default:
        return <History className="text-gray-400" size={16} />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'follow':
        return `Started following ${activity.targetName}`;
      case 'unfollow':
        return `Unfollowed ${activity.targetName}`;
      case 'view_company':
        return `Viewed ${activity.targetName}'s profile`;
      case 'save_company':
        return `Saved ${activity.targetName} to favorites`;
      case 'unsave_company':
        return `Removed ${activity.targetName} from favorites`;
      case 'event_register':
        return `Registered for ${activity.targetName}`;
      default:
        return 'Unknown activity';
    }
  };

  const getTargetIcon = (type: Activity['targetType']) => {
    switch (type) {
      case 'user':
        return <Users className="text-gray-400" size={16} />;
      case 'company':
        return <Building2 className="text-gray-400" size={16} />;
      case 'event':
        return <Calendar className="text-gray-400" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Recent Activities</h1>
              <div className="text-gray-600">
                Last 7 days
              </div>
            </div>

            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900">
                        {getActivityText(activity)}
                      </p>
                      {activity.details && (
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.details}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        {getTargetIcon(activity.targetType)}
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {activities.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg">
                  <History className="mx-auto text-gray-400 mb-3" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Recent Activities</h3>
                  <p className="text-gray-600">Your recent activities will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 