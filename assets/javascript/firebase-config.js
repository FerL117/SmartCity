  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
  
  const firebaseConfig = {
    apiKey: "AIzaSyCX1InFYGC1aBOlLCK04QGbQpIs52BkAyQ",
    authDomain: "smart-city-acfcf.firebaseapp.com",
    projectId: "smart-city-acfcf",
    storageBucket: "smart-city-acfcf.firebasestorage.app",
    messagingSenderId: "8228371726",
    appId: "1:8228371726:web:3d65c890c8140de0e02b5f"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export { app, auth, db }