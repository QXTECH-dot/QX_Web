import { NextRequest } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}
const db = getFirestore();

export async function GET(req: NextRequest) {
  const snapshot = await db.collection('events').get();
  const events = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: data.id || doc.id,
      title: data.title || '',
      date: data.date || '',
      location: {
        state: data.location?.state || '',
        venue: data.location?.venue || '',
        address: data.location?.address || '',
        city: data.location?.city || '',
        postcode: data.location?.postcode || '',
      },
      organizer: {
        id: data.organizer?.id || '',
        name: data.organizer?.name || '',
        logo: data.organizer?.logo || data.logo || '',
        description: data.organizer?.description || '',
      },
      theme: data.theme || '',
      summary: data.summary || data.description?.slice(0, 80) || '',
      description: data.description || '',
      schedule: Array.isArray(data.schedule) ? data.schedule : [],
      attendees: Array.isArray(data.attendees) ? data.attendees : [],
    };
  });
  return new Response(JSON.stringify(events), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
} 