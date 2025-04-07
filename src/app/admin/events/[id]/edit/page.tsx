"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ClientEditPage from './ClientPage';

// Remove generateStaticParams from the edit page

export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Edit Event</h1>
          <p className="text-gray-600">Make changes to the event details.</p>
        </div>

        <ClientEditPage eventId={params.id} />
      </div>
    </AdminLayout>
  );
}
