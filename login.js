import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const loginBtn = document.querySelector(".login-btn");

loginBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    const email = document.querySelector(
        'input[type="email"]'
    ).value;

    const password = document.querySelector(
        'input[type="password"]'
    ).value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Login Successful 🔥");

        window.location.href = "dashboard.html";

    }

    catch(error){

        alert(error.message);

    }

});