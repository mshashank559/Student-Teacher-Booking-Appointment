// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCbvGKpvhg383BreXZng0q7PvuHGluE_XE",
    authDomain: "student-teacher-booking-95f4e.firebaseapp.com",
    projectId: "student-teacher-booking-95f4e",
    storageBucket: "student-teacher-booking-95f4e.firebasestorage.app",
    messagingSenderId: "295615667170",
    appId: "1:295615667170:web:c5d80d1cd4b42c18d9b7bb",
    measurementId: "G-0H2NVYFVTV"
  
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
