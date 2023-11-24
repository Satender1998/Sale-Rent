// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-c2e51.firebaseapp.com",
  projectId: "estate-c2e51",
  storageBucket: "estate-c2e51.appspot.com",
  messagingSenderId: "298857081888",
  appId: "1:298857081888:web:d1d200763478404e37e045"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);