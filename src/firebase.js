import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
// Note: We'll add a check to only initialize if config is present to prevent crashes
let app;
let db;

try {
    // For now, we will use a dummy initialization if config is missing so the app doesn't crash on start
    // In a real scenario, this should be properly configured.
    // We can also allow the user to input keys in the UI if we want to be fancy, but hardcoding for now is standard.
    if (firebaseConfig.apiKey) {
        app = initializeApp(firebaseConfig);
        db = getDatabase(app);
    } else {
        console.warn("Firebase config missing. App will run in local-only mode.");
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

export { db };
