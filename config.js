// firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZQKHuXmNqN_N7ULM9oWBDJW2ykED7BkE",
  authDomain: "bookingsystem12.firebaseapp.com",
  projectId: "bookingsystem12",
  storageBucket: "bookingsystem12.appspot.com",
  messagingSenderId: "151056229871",
  appId: "1:151056229871:web:04ef8186ef147fda67421a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
