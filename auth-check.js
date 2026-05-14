import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("User Logged In");

    } 
    
    else {

        window.location.href = "login.html";

    }

});