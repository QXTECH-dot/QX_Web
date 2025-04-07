"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ClientAddEventPage from './ClientPage';

export default function AddEventPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Add New Event</h1>
          <p className="text-gray-600">Create a new event for QX Net users.</p>
        </div>

        <ClientAddEventPage />
      </div>
    </AdminLayout>
  );
}
