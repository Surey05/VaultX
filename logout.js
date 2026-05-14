import { auth } from "./firebase.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const logoutBtn =
document.querySelector(".logout-btn");

if(logoutBtn){

    logoutBtn.addEventListener("click", async () => {

        try{

            await signOut(auth);

            alert("Logged Out Successfully");

            window.location.href = "index.html";

        }

        catch(error){

            console.log(error);

        }

    });

}