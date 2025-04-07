"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/admin/EventForm';
import { Event } from '@/types/event';

export default function ClientAddEventPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (eventData: Partial<Event>) => {
    setIsSaving(true);

    // In a real application, this would call an API to save the event
    console.log('New event data:', eventData);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      router.push('/admin/events');
    }, 1000);
  };

  const handleCancel = () => {
    router.push('/admin/events');
  };

  return (
    <>
      <EventForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <div className="animate-pulse">
              <div className="h-4 bg-qxnet-100 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-qxnet-100 rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-center mt-4">Saving your event...</p>
          </div>
        </div>
      )}
    </>
  );
}
