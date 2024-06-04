// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

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


const app = initializeApp(firebaseConfig);
export const imgStorage = getStorage(app);