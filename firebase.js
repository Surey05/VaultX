// Firebase App
import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

// Auth
import { getAuth }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// Firestore
import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// Config
const firebaseConfig = {

    apiKey: "AIzaSyAfWuAjZFFFMatxgnlKubkoghMwtVftLts",

    authDomain: "vaultx-1d9c3.firebaseapp.com",

    projectId: "vaultx-1d9c3",

    storageBucket: "vaultx-1d9c3.firebasestorage.app",

    messagingSenderId: "617738272723",

    appId: "1:617738272723:web:98f164d32149f73e3ff926",

    measurementId: "G-72M2ZDWZ6K"

};


// Initialize App
const app =
initializeApp(firebaseConfig);


// Auth
const auth =
getAuth(app);


// Firestore
const db =
getFirestore(app);


// Export
export { auth, db };