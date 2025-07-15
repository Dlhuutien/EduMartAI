// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0HFIc_2trxLfJn-D135X4SxZ5j6_986I",
  authDomain: "aillecta.firebaseapp.com",
  projectId: "aillecta",
  storageBucket: "aillecta.firebasestorage.app",
  messagingSenderId: "607339686736",
  appId: "1:607339686736:web:3e13dae11fb88dd1d51a55",
  measurementId: "G-3DNS4CXP29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, provider, signInWithPopup, signOut };
