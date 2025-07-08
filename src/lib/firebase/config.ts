import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_JzocS0akP7yWAMCelO8l6at3RGxHMdU",
  authDomain: "qx-net-next-js.firebaseapp.com",
  projectId: "qx-net-next-js",
  storageBucket: "qx-net-next-js.firebasestorage.app",
  messagingSenderId: "412313045911",
  appId: "1:412313045911:web:cbb21106eb73a8fb1352d2",
  measurementId: "G-MER4ZNDV5H"
};

// Debug logging
console.log('[Firebase Config] Initializing Firebase...');
console.log('[Firebase Config] Environment:', typeof window !== 'undefined' ? 'client' : 'server');
console.log('[Firebase Config] Project ID:', firebaseConfig.projectId);

// Initialize Firebase
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log('[Firebase Config] Firebase app initialized successfully');
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
  console.log('[Firebase Config] Firestore and Storage initialized successfully');
} catch (error) {
  console.error('[Firebase Config] Error initializing Firestore/Storage:', error);
  throw error;
}

// Only initialize analytics on the client side
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
    console.log('[Firebase Config] Analytics initialized successfully');
  } catch (error) {
    console.warn('[Firebase Config] Analytics initialization failed:', error);
  }
}

export { app, analytics, db, storage }; 