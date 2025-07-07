// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAsAougMq-7BOZglpKi0fH75WgPRXdnLMs",
  authDomain: "tnea-b56eb.firebaseapp.com",
  projectId: "tnea-b56eb",
  storageBucket: "tnea-b56eb.firebasestorage.app",
  messagingSenderId: "377947264382",
  appId: "1:377947264382:web:a1292f6c69e0f52b934f2f",
  measurementId: "G-6XN6V17573"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;