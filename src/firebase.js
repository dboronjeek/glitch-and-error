import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPZSXpEEy507DDcXgfRVxsQbbIldiDV6U",
  authDomain: "gaming-blog-db.firebaseapp.com",
  projectId: "gaming-blog-db",
  storageBucket: "gaming-blog-db.firebasestorage.app",
  messagingSenderId: "260292357418",
  appId: "1:260292357418:web:def02ce5c0def44ecc8253",
  measurementId: "G-SXF1CX8RDJ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
