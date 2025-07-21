// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrL5yC5RUBsUfaeh-9FvWXKHAQGoYbFho",
  authDomain: "tnea-college-predictor.firebaseapp.com",
  projectId: "tnea-college-predictor",
  storageBucket: "tnea-college-predictor.appspot.com", // fixed to .appspot.com
  messagingSenderId: "256306899209",
  appId: "1:256306899209:web:854a233d4cd9ef7618cbd8",
  measurementId: "G-E5DXKDM7SK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Optional: Only initialize analytics in the browser
declare const window: any;
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };