import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC6kjE1cyspB7XXhGbN5UvLyOBGwnF2om8",
  authDomain: "justixai.firebaseapp.com",
  projectId: "justixai",
  storageBucket: "justixai.firebasestorage.app",
  messagingSenderId: "514519018584",
  appId: "1:514519018584:web:a825f98aade8af32386e2d",
  measurementId: "G-YJPP1PE3GW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);