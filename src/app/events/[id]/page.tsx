import React from "react";
import EventDetails from "@/components/events/EventDetails";
import { eventsData } from "@/data/eventsData";
import { notFound } from "next/navigation";

// Generate static params for all events
export function generateStaticParams() {
  return eventsData.map((event) => ({
    id: event.id,
  }));
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = eventsData.find((event) => event.id === params.id);

  // If event not found, return 404
  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventDetails event={event} />
    </div>
  );
}
