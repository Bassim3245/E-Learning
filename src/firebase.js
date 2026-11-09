import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAug-n89YkHbrcRSCrwfs46E6aS90vi0Bk",
  authDomain: "bizflow-wvuva.firebaseapp.com",
  projectId: "bizflow-wvuva",
  storageBucket: "bizflow-wvuva.firebasestorage.app",
  messagingSenderId: "101652303700",
  appId: "1:101652303700:web:a795b156bb3ec891f5c2c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

