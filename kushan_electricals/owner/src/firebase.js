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

  apiKey: "AIzaSyBA4r8CHSmvtaS2kaMn23gXRKloNJ_mmqk",

  authDomain: "kushan-electricals.firebaseapp.com",

  projectId: "kushan-electricals",

  storageBucket: "kushan-electricals.appspot.com",

  messagingSenderId: "606383824294",

  appId: "1:606383824294:web:94dc105611c8e717c80367",

  measurementId: "G-VKB5238QJE"

};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const imgDB = getStorage(app);

export {firestore, imgDB};