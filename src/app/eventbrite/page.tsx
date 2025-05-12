import React from 'react';

async function getEventbriteData() {
  // Query event details by event_id: 1317171628799
  const API_KEY = 'ZWXJYJ33R4L32A32U32D';
  const url = 'https://www.eventbriteapi.com/v3/events/1317171628799/';
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    return { error: `Request failed: ${res.status}` };
  }
  return res.json();
}

export default async function EventbritePage() {
  const data = await getEventbriteData();
  if (data.error) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Eventbrite Event Details</h1>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  // Extract all major fields
  const name = data.name?.text || '';
  const description = data.description?.text || '';
  const url = data.url || '';
  const start = data.start?.local || '';
  const end = data.end?.local || '';
  const organizerId = data.organizer_id || '';
  const venueId = data.venue_id || '';
  const logoUrl = data.logo?.original?.url || '';
  const summary = data.summary || '';
  const status = data.status || '';
  const currency = data.currency || '';
  const locale = data.locale || '';
  const isFree = data.is_free ? 'Yes' : 'No';
  const isOnline = data.online_event ? 'Yes' : 'No';
  const created = data.created || '';
  const changed = data.changed || '';
  const published = data.published || '';
  const categoryId = data.category_id || '';
  const subcategoryId = data.subcategory_id || '';

  return (
    <div className="container py-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      {logoUrl && (
        <img src={logoUrl} alt="event cover" className="mb-6 rounded shadow w-full max-h-80 object-cover" />
      )}
      <div className="mb-2 text-gray-700"><span className="font-semibold">Event Summary: </span>{summary}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Description: </span>{description}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Start Time: </span>{start}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">End Time: </span>{end}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Organizer ID: </span>{organizerId}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Venue ID: </span>{venueId}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Category ID: </span>{categoryId}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Subcategory ID: </span>{subcategoryId}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Status: </span>{status}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Currency: </span>{currency}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Locale: </span>{locale}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Is Free: </span>{isFree}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Is Online: </span>{isOnline}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Created: </span>{created}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Changed: </span>{changed}</div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">Published: </span>{published}</div>
      <div className="mb-6">
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">View on Eventbrite</a>
      </div>
    </div>
  );
} 