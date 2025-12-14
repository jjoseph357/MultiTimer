import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    // PLACEHOLDER: Replace with your Firebase config object
    // apiKey: "AIzaSy...",
    // authDomain: "project-id.firebaseapp.com",
    // databaseURL: "https://project-id-default-rtdb.firebaseio.com",
    // projectId: "project-id",
    // storageBucket: "project-id.appspot.com",
    // messagingSenderId: "...",
    // appId: "..."
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
