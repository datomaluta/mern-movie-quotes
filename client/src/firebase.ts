// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "movie-quotes-34603.firebaseapp.com",
  projectId: "movie-quotes-34603",
  storageBucket: "movie-quotes-34603.appspot.com",
  messagingSenderId: "606393005844",
  appId: "1:606393005844:web:9d7bb7f1807b4dc82d7401",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
