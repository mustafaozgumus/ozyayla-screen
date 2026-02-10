
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQJmtm-mgs7XymoBxKzxUg-Tbk7TdMBPA",
  authDomain: "ozyayla.firebaseapp.com",
  projectId: "ozyayla",
  storageBucket: "ozyayla.firebasestorage.app",
  messagingSenderId: "3304980392",
  appId: "1:3304980392:web:7e2f01663ffe3ef813e79d"
};

// Initialize Firebase only if no apps are initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore
export const db = getFirestore(app);
