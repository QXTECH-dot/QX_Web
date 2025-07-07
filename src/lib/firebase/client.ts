import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_JzocS0akP7yWAMCelO8l6at3RGxHMdU",
  authDomain: "qx-net-next-js.firebaseapp.com",
  projectId: "qx-net-next-js",
  storageBucket: "qx-net-next-js.firebasestorage.app",
  messagingSenderId: "412313045911",
  appId: "1:412313045911:web:cbb21106eb73a8fb1352d2",
  measurementId: "G-MER4ZNDV5H"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export let analytics: ReturnType<typeof import('firebase/analytics').getAnalytics> | undefined = undefined;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export default app; 