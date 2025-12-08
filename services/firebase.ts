import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQJmtm-mgs7XymoBxKzxUg-Tbk7TdMBPA",
  authDomain: "ozyayla.firebaseapp.com",
  projectId: "ozyayla",
  storageBucket: "ozyayla.firebasestorage.app",
  messagingSenderId: "3304980392",
  appId: "1:3304980392:web:7e2f01663ffe3ef813e79d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
