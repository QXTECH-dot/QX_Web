"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import EventsManager from '@/components/admin/EventsManager';

export default function AdminEventsPage() {
  return (
    <AdminLayout>
      <EventsManager />
    </AdminLayout>
  );
}
