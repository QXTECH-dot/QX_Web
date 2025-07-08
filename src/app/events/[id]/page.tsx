import React from "react";
import EventDetails from "@/components/events/EventDetails";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Event } from "@/types/event";
import { notFound } from "next/navigation";

// Generate static params for all events from Firestore
export async function generateStaticParams() {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
  } catch (error) {
    console.warn('[Events] Failed to generate static params from Firestore:', error);
    // Return empty array as fallback to prevent build failure
    return [];
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  try {
    // Firestore获取事件详情
    const docRef = doc(db, "events", params.id);
    const docSnap = await getDoc(docRef);
    let event: Event | null = null;
    if (docSnap.exists()) {
      event = docSnap.data() as Event;
    }
    if (!event) {
      notFound();
    }
    return (
      <div className="min-h-screen bg-gray-50">
        <EventDetails event={event} />
      </div>
    );
  } catch (error) {
    console.error('[Events] Error loading event:', error);
    notFound();
  }
}
