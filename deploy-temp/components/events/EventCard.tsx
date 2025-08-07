"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
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
    <Link href={`/events/${event.id}`}>
      <div className="border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-md transition-shadow bg-white">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Event logo and date */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-20 h-20 relative mb-2">
              <Image
                src={event.organizer.logo}
                alt={event.organizer.name}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(event.date)}
            </div>
          </div>

          {/* Event details */}
          <div className="flex-grow">
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>

            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.location.venue}, {event.location.city}, {event.location.state} 🥣</span>
            </div>

            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Organized by:</span>
              <span className="font-medium">{event.organizer.name}</span>
            </div>

            <div className="mb-2">
              <span className="inline-block bg-qxnet-50 text-qxnet-700 px-3 py-1 rounded-full text-sm font-medium">
                {event.theme}
              </span>
            </div>

            <p className="text-gray-600 line-clamp-2">{event.summary}</p>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex -space-x-2">
                {event.attendees.slice(0, 3).map((attendee) => (
                  <div key={attendee.id} className="w-8 h-8 relative rounded-full overflow-hidden border-2 border-white">
                    <Image
                      src={attendee.companyLogo}
                      alt={attendee.companyName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {event.attendees.length > 3 && (
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full border-2 border-white">
                    <span className="text-xs text-gray-600">+{event.attendees.length - 3}</span>
                  </div>
                )}
              </div>

              <span className="text-qxnet font-medium">View Details →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
