// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_hzvfGc94xx5ChZXkPoHb7kn7GnOD3-I",
  authDomain: "champions-stores.firebaseapp.com",
  projectId: "champions-stores",
  storageBucket: "champions-stores.appspot.com",
  messagingSenderId: "1081683885774",
  appId: "1:1081683885774:web:f508204a115d4a06005a9f",
  measurementId: "G-EP6ME9ES0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const imgDB = getStorage(app);

export {firestore, imgDB};