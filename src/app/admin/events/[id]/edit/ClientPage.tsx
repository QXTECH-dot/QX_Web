"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/admin/EventForm';
import { Event } from '@/types/event';
import { getEventById } from '@/data/eventsData';

interface ClientEditPageProps {
  eventId: string;
}

export default function ClientEditPage({ eventId }: ClientEditPageProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (eventId) {
      const eventData = getEventById(eventId);

      if (eventData) {
        setEvent(eventData);
      } else {
        // Event not found, redirect to events list
        router.push('/admin/events');
      }

      setLoading(false);
    }
  }, [eventId, router]);

  const handleSubmit = (eventData: Partial<Event>) => {
    setIsSaving(true);

    // In a real application, this would call an API to update the event
    console.log('Updated event data:', eventData);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      router.push('/admin/events');
    }, 1000);
  };

  const handleCancel = () => {
    router.push('/admin/events');
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
        <div className="h-96 bg-gray-200 rounded mb-8"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/admin/events')}
          className="bg-qxnet hover:bg-qxnet-600 text-black font-medium py-2 px-4 rounded-md transition-colors"
        >
          Return to Events
        </button>
      </div>
    );
  }

  return (
    <>
      <EventForm
        event={event}
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
            <p className="text-center mt-4">Saving your changes...</p>
          </div>
        </div>
      )}
    </>
  );
}
