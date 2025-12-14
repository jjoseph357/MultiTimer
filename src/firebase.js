import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBSPwtIAPTK9JgGlLqXzjhz20e_zAQ_OJE",
    authDomain: "teamsync-7f05a.firebaseapp.com",
    databaseURL: "https://teamsync-7f05a-default-rtdb.firebaseio.com",
    projectId: "teamsync-7f05a",
    storageBucket: "teamsync-7f05a.firebasestorage.app",
    messagingSenderId: "318853385772",
    appId: "1:318853385772:web:3f733dabb03e164e0d0b89",
    measurementId: "G-HSMZB48K0S"
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
