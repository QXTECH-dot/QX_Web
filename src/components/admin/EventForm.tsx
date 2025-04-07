"use client";

import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { Event, EventSession, Attendee } from '@/types/event';

interface EventFormProps {
  event?: Event; // If provided, we're editing an existing event
  onSubmit: (eventData: Partial<Event>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel
}) => {
  // Form state
  const [formData, setFormData] = useState<Partial<Event>>(
    event || {
      title: '',
      date: new Date().toISOString().split('T')[0],
      location: {
        state: '',
        venue: '',
        address: '',
        city: '',
        postcode: '',
      },
      organizer: {
        id: '',
        name: '',
        logo: '',
        description: '',
      },
      theme: '',
      summary: '',
      description: '',
      schedule: [],
      attendees: [],
    }
  );

  // Session form state (for adding new sessions)
  const [sessionForm, setSessionForm] = useState<Partial<EventSession>>({
    title: '',
    startTime: '',
    endTime: '',
    description: '',
    speaker: '',
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle nested fields (location, organizer)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof Event] as any),
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle session form changes
  const handleSessionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSessionForm({
      ...sessionForm,
      [name]: value
    });
  };

  // Add a new session
  const handleAddSession = () => {
    if (!sessionForm.title || !sessionForm.startTime || !sessionForm.endTime) return;

    const newSession = {
      id: `session-${Date.now()}`,
      title: sessionForm.title || '',
      startTime: sessionForm.startTime || '',
      endTime: sessionForm.endTime || '',
      description: sessionForm.description || '',
      speaker: sessionForm.speaker || undefined,
    };

    setFormData({
      ...formData,
      schedule: [...(formData.schedule || []), newSession]
    });

    // Reset session form
    setSessionForm({
      title: '',
      startTime: '',
      endTime: '',
      description: '',
      speaker: '',
    });
  };

  // Remove a session
  const handleRemoveSession = (sessionId: string) => {
    setFormData({
      ...formData,
      schedule: (formData.schedule || []).filter(s => s.id !== sessionId)
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold">{event ? 'Edit Event' : 'Create New Event'}</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date*</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Theme*</label>
                <input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary*</label>
                <input
                  type="text"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Location information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Location Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                <select
                  name="location.state"
                  value={formData.location?.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                >
                  <option value="">Select State</option>
                  <option value="NSW">New South Wales</option>
                  <option value="VIC">Victoria</option>
                  <option value="QLD">Queensland</option>
                  <option value="WA">Western Australia</option>
                  <option value="SA">South Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="ACT">Australian Capital Territory</option>
                  <option value="NT">Northern Territory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location?.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue*</label>
                <input
                  type="text"
                  name="location.venue"
                  value={formData.location?.venue}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode*</label>
                <input
                  type="text"
                  name="location.postcode"
                  value={formData.location?.postcode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location?.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Organizer information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Organizer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Name*</label>
                <input
                  type="text"
                  name="organizer.name"
                  value={formData.organizer?.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Logo URL*</label>
                <input
                  type="url"
                  name="organizer.logo"
                  value={formData.organizer?.logo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Description*</label>
                <textarea
                  name="organizer.description"
                  value={formData.organizer?.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-medium mb-4">Event Schedule</h3>

            {/* Existing sessions */}
            {formData.schedule && formData.schedule.length > 0 && (
              <div className="mb-6 space-y-4">
                {formData.schedule.map((session) => (
                  <div key={session.id} className="flex items-start bg-gray-50 p-4 rounded-md">
                    <div className="flex-grow">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-3">
                          <span className="block text-sm text-gray-500">Title</span>
                          <span className="font-medium">{session.title}</span>
                        </div>
                        <div>
                          <span className="block text-sm text-gray-500">Start Time</span>
                          <span className="font-medium">{session.startTime}</span>
                        </div>
                        <div>
                          <span className="block text-sm text-gray-500">End Time</span>
                          <span className="font-medium">{session.endTime}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="block text-sm text-gray-500">Description</span>
                        <span>{session.description}</span>
                      </div>
                      {session.speaker && (
                        <div className="mt-1">
                          <span className="block text-sm text-gray-500">Speaker</span>
                          <span>{session.speaker}</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSession(session.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new session form */}
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h4 className="font-medium mb-4">Add New Session</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={sessionForm.title}
                    onChange={handleSessionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time*</label>
                  <input
                    type="time"
                    name="startTime"
                    value={sessionForm.startTime}
                    onChange={handleSessionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time*</label>
                  <input
                    type="time"
                    name="endTime"
                    value={sessionForm.endTime}
                    onChange={handleSessionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={sessionForm.description}
                    onChange={handleSessionChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speaker (optional)</label>
                  <input
                    type="text"
                    name="speaker"
                    value={sessionForm.speaker}
                    onChange={handleSessionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddSession}
                className="flex items-center px-4 py-2 bg-qxnet hover:bg-qxnet-600 text-black rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Session
              </button>
            </div>
          </div>

          {/* Form actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-qxnet hover:bg-qxnet-600 text-black font-medium rounded-md transition-colors"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
