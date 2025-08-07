"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Clock, Users, Star, Building } from "lucide-react";
import { Event } from "@/types/event";
import AttendeeCard from "./AttendeeCard";

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Event header */}
        <div className="bg-qxnet-50 p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 relative flex-shrink-0">
              <Image
                src={event.organizer.logo}
                alt={event.organizer.name}
                fill
                className="object-contain rounded-lg bg-white p-2"
              />
            </div>

            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold mb-3">{event.title}</h1>

              <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center md:justify-start">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-qxnet" />
                  <span>{formatDate(event.date)}</span>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-qxnet" />
                  <span>{event.location.venue}, {event.location.city}</span>
                </div>

                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-qxnet" />
                  <span>Organized by: {event.organizer.name}</span>
                </div>
              </div>

              <span className="inline-block bg-qxnet px-4 py-1 rounded-full text-black font-medium">
                {event.theme}
              </span>
            </div>
          </div>
        </div>

        {/* Event content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event details */}
            <div className="col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
                <div className="space-y-4">
                  {event.schedule.map((session) => (
                    <div key={session.id} className="border-l-4 border-qxnet pl-4 py-2">
                      <div className="flex items-center mb-1">
                        <Clock className="h-4 w-4 mr-2 text-qxnet" />
                        <span className="font-medium">{session.startTime} - {session.endTime}</span>
                      </div>
                      <h3 className="font-bold text-lg">{session.title}</h3>
                      <p className="text-gray-600 mt-1">{session.description}</p>
                      {session.speaker && (
                        <p className="text-gray-500 text-sm mt-1">Speaker: {session.speaker}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event location and organizer */}
            <div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-3">Location</h3>
                <div className="space-y-2">
                  <p className="font-medium">{event.location.venue}</p>
                  <p>{event.location.address}</p>
                  <p>{event.location.city}, {event.location.state} {event.location.postcode}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Organizer</h3>
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 relative mr-3">
                    <Image
                      src={event.organizer.logo}
                      alt={event.organizer.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <h4 className="font-bold">{event.organizer.name}</h4>
                </div>
                <p className="text-gray-700">{event.organizer.description}</p>
              </div>
            </div>
          </div>

          {/* Attendees section */}
          <div className="mt-12">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 mr-2 text-qxnet" />
              <h2 className="text-2xl font-bold">Attendees ({event.attendees.length})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {event.attendees.map((attendee) => (
                <AttendeeCard key={attendee.id} attendee={attendee} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
