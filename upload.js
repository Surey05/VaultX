import { db ,auth}
from "./firebase.js";

import {

    collection,
    addDoc

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// Google Client ID
const CLIENT_ID =
"382550327110-6gdk9j08j37l60kmbp6v86sebc6g8l5a.apps.googleusercontent.com";


// Google Scope
const SCOPES =
"https://www.googleapis.com/auth/drive.file";


// Elements
const fileInput =
document.getElementById("fileInput");

const selectedFile =
document.getElementById("selectedFile");

const uploadBtn =
document.querySelector(".upload-btn");


// Current File
let currentFile = null;


// File Select
fileInput.addEventListener("change", () => {

    if(fileInput.files.length > 0){

        currentFile =
        fileInput.files[0];

        selectedFile.innerHTML =
        currentFile.name;

    }

});


// Upload Function
async function uploadToDrive(accessToken){

    try{

        // Category
        const category =
        document.querySelectorAll("select")[0].value;

        const subcategory ="General";


        // Search Folder
        const folderSearch =
        await fetch(

`https://www.googleapis.com/drive/v3/files?q=name='${category}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,

            {

                headers: {

                    Authorization:
                    `Bearer ${accessToken}`

                }

            }

        );


        const folderData =
        await folderSearch.json();


        let folderId;


        // Create Folder if Missing
        if(folderData.files.length === 0){

            const createFolder =
            await fetch(

                "https://www.googleapis.com/drive/v3/files",

                {

                    method: "POST",

                    headers: {

                        Authorization:
                        `Bearer ${accessToken}`,

                        "Content-Type":
                        "application/json"

                    },

                    body: JSON.stringify({

                        name: category,

                        mimeType:
                        "application/vnd.google-apps.folder"

                    })

                }

            );


            const newFolder =
            await createFolder.json();

            folderId =
            newFolder.id;

        }

        else{

            folderId =
            folderData.files[0].id;

        }


        // File Metadata
        const metadata = {

            name: currentFile.name,

            mimeType: currentFile.type,

            parents: [folderId]

        };


        // Form Data
        const form =
        new FormData();

        form.append(

            "metadata",

            new Blob(

                [JSON.stringify(metadata)],

                {
                    type: "application/json"
                }

            )

        );

        form.append(
            "file",
            currentFile
        );


        // Multipart Upload
        const uploadResponse =
        await fetch(

"https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",

            {

                method: "POST",

                headers: {

                    Authorization:
                    `Bearer ${accessToken}`

                },

                body: form

            }

        );


        const data =
        await uploadResponse.json();

        console.log(data);


        if(data.error){

            alert(data.error.message);

            return;

        }


        // Make Public
        await fetch(

`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`,

            {

                method: "POST",

                headers: {

                    Authorization:
                    `Bearer ${accessToken}`,

                    "Content-Type":
                    "application/json"

                },

                body: JSON.stringify({

                    role: "reader",

                    type: "anyone"

                })

            }

        );


        // Drive Preview URL
        const fileURL =

`https://drive.google.com/file/d/${data.id}/preview`;


        // Save Firestore
        await addDoc(

            collection(db, "documents"),

            {
                uid: auth.currentUser.uid,

                name: currentFile.name,

                category: category,

                subcategory: subcategory,

                uploadedAt:
                new Date().toLocaleString(),

                driveURL: fileURL,

                driveFileId: data.id

            }

        );


        alert(
            "Uploaded Successfully 🔥"
        );


        // Reset
        fileInput.value = "";

        selectedFile.innerHTML =
        "No file selected";

        currentFile = null;

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}


// Upload Button
uploadBtn.addEventListener("click", () => {

    if(!currentFile){

        alert("Please select a file");

        return;

    }


    // Google Token Client
    const tokenClient =

    google.accounts.oauth2.initTokenClient({

        client_id: CLIENT_ID,

        scope: SCOPES,

        callback: async (tokenResponse) => {

            if(tokenResponse.error){

                console.log(tokenResponse);

                return;

            }

            const accessToken =
            tokenResponse.access_token;

            await uploadToDrive(accessToken);

        }

    });


    // Request Token
    tokenClient.requestAccessToken();

});