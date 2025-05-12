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
  const events = snapshot.docs.map(doc => doc.data());
  return new Response(JSON.stringify(events), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
} 