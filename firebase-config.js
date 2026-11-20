import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeL5Im2-9nd-1VPNL2ZFLKDt6HsIdLRTk",
  authDomain: "scouts-7cd69.firebaseapp.com",
  projectId: "scouts-7cd69",
  storageBucket: "scouts-7cd69.firebasestorage.app",
  messagingSenderId: "998618818755",
  appId: "1:998618818755:web:326f8845a8bfa424321a76",
  measurementId: "G-MN9TR4H2BG"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
