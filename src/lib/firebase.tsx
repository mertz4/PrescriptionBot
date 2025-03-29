// 1. First, let's set up your Firebase config file in @lib/firebase.ts

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC9fCT1JN8jt-ST88jLS_BFXTor_O6KiTE",
    authDomain: "medication-app-d615b.firebaseapp.com",
    projectId: "medication-app-d615b",
    storageBucket: "medication-app-d615b.firebasestorage.app",
    messagingSenderId: "699224297742",
    appId: "1:699224297742:web:f29632535fdd2e9539475f",
    measurementId: "G-PTNQ89C800"
  };

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };