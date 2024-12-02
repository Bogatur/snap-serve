// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdNKxRizhY3YhueEfCPbjXA5Z-14shv7I",
  authDomain: "snap-serve-d09ad.firebaseapp.com",
  projectId: "snap-serve-d09ad",
  storageBucket: "snap-serve-d09ad.firebasestorage.app",
  messagingSenderId: "51577749899",
  appId: "1:51577749899:web:72f35015656faf5bfb2f8e",
  measurementId: "G-GRRLTNG9RV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };