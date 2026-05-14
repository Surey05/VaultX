import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const registerBtn =
document.querySelector(".login-btn");

registerBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try{

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Account Created Successfully 🔥");

        window.location.href = "login.html";

    }

    catch(error){

        alert(error.message);

    }

});