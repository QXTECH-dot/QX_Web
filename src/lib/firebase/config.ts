import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD_JzocS0akP7yWAMCelO8l6at3RGxHMdU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "qx-net-next-js.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "qx-net-next-js",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "qx-net-next-js.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "412313045911",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:412313045911:web:cbb21106eb73a8fb1352d2",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MER4ZNDV5H"
};

// Initialize Firebase
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} catch (error) {
  console.error('[Firebase Config] Error initializing Firebase app:', error);
  throw error;
}

let analytics = null;
let db: Firestore;
let storage: FirebaseStorage;

try {
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error('[Firebase Config] Error initializing Firestore/Storage:', error);
  throw error;
}

// Only initialize analytics on the client side
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('[Firebase Config] Analytics initialization failed:', error);
  }
}

export { app, analytics, db, storage }; 