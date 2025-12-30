import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyACn3sqtCdt5LSdO657nf1CHti19aToxCE",
//   authDomain: "friends-a5f47.firebaseapp.com",
//   projectId: "friends-a5f47",
//   storageBucket: "friends-a5f47.firebasestorage.app",
//   messagingSenderId: "1013690470282",
//   appId: "1:1013690470282:web:8695d5b794660f6cb30273",
//   measurementId: "G-QR01WQ5G65"
// };

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });

export const adminAuth = getAuth(app);
