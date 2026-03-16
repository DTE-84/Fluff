import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAoV1Oyd2hg4O69LW9CjdnopflzgiKobaI",
  authDomain: "fluff-e08ef.firebaseapp.com",
  projectId: "fluff-e08ef",
  storageBucket: "fluff-e08ef.firebasestorage.app",
  messagingSenderId: "24538469958",
  appId: "1:24538469958:web:5ff818ea3d517736f51c47"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);