// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_hzvfGc94xx5ChZXkPoHb7kn7GnOD3-I",
  authDomain: "champions-stores.firebaseapp.com",
  projectId: "champions-stores",
  storageBucket: "champions-stores.appspot.com",
  messagingSenderId: "1081683885774",
  appId: "1:1081683885774:web:f508204a115d4a06005a9f",
  measurementId: "G-EP6ME9ES0R"
};


const app = initializeApp(firebaseConfig);
export const imgStorage = getStorage(app);