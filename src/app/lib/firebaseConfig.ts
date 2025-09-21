import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSbZVapCVXyNtGf_7a2JmQdbJJleeYYPQ",
    authDomain: "echowave-24cb9.firebaseapp.com",
    projectId: "echowave-24cb9",
    storageBucket: "echowave-24cb9.appspot.com",
    messagingSenderId: "1063278862223",
    appId: "1:1063278862223:web:56676f05849505868e35fa",
    measurementId: "G-VPQP4YDD36",
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
