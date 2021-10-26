import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDvSR669Bgrm258B6wxh8kfJEIBd3aR93w',
    authDomain: 'clonewebsite-eb6e6.firebaseapp.com',
    databaseURL: 'https://clonewebsite-eb6e6-default-rtdb.firebaseio.com',
    projectId: 'clonewebsite-eb6e6',
    storageBucket: 'clonewebsite-eb6e6.appspot.com',
    messagingSenderId: '834377877962',
    appId: '1:834377877962:web:658510eb0681943ea32733',
    measurementId: 'G-7YRRRSCDTG',
};

// Initialize Firebase
export const App = initializeApp(firebaseConfig);
export const db = getFirestore();

/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvSR669Bgrm258B6wxh8kfJEIBd3aR93w",
  authDomain: "clonewebsite-eb6e6.firebaseapp.com",
  databaseURL: "https://clonewebsite-eb6e6-default-rtdb.firebaseio.com",
  projectId: "clonewebsite-eb6e6",
  storageBucket: "clonewebsite-eb6e6.appspot.com",
  messagingSenderId: "834377877962",
  appId: "1:834377877962:web:658510eb0681943ea32733",
  measurementId: "G-7YRRRSCDTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/
