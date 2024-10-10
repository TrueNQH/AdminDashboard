// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, getDocs,addDoc, collection, query, where} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0AXkUX1O6-etuJc0939P0593iw8AULLI",
  authDomain: "admindashboard-f6b78.firebaseapp.com",
  projectId: "admindashboard-f6b78",
  storageBucket: "admindashboard-f6b78.appspot.com",
  messagingSenderId: "140870461600",
  appId: "1:140870461600:web:17ea10e26b299e430d81c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {app, db, getFirestore, addDoc, collection, query, where, getDocs};
