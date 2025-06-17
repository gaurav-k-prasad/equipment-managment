
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

// Check if essential config values are present and don't look like common placeholders
const essentialConfigPresent =
  firebaseConfigValues.apiKey &&
  firebaseConfigValues.apiKey !== "YOUR_API_KEY" && // Example placeholder
  firebaseConfigValues.projectId &&
  firebaseConfigValues.projectId !== "YOUR_PROJECT_ID"; // Example placeholder

if (typeof window !== 'undefined') {
  if (essentialConfigPresent) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfigValues);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    console.warn(
      "Firebase SDK not initialized due to missing or placeholder API key/project ID. " +
      "Authentication and other Firebase services will not be available. " +
      "Please update your .env file with correct Firebase credentials and restart the server."
    );
    // app, auth, db, storage remain undefined
  }
} else {
  // For server-side, behavior might differ or these might not be needed.
  // This setup primarily targets client-side Firebase usage.
}

export { app, auth, db, storage };
