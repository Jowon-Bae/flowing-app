import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDhTV0ka4nxPuGA-0K2GRsqVNJiLzjc9TU",
  authDomain: "the-sender-f22dd.firebaseapp.com",
  projectId: "the-sender-f22dd",
  storageBucket: "the-sender-f22dd.firebasestorage.app",
  messagingSenderId: "232021213261",
  appId: "1:232021213261:web:d5126316fadffe96e3dc04"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
