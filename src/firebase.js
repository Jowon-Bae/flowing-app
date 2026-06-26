import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmbMiGkFqfTJxM8AQUg22P9G-skFpyNMM",
  authDomain: "passion-week-app-d8de9.firebaseapp.com",
  projectId: "passion-week-app-d8de9",
  storageBucket: "passion-week-app-d8de9.firebasestorage.app",
  messagingSenderId: "427337609258",
  appId: "1:427337609258:web:c2d74e7a179235ca2c9353"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
