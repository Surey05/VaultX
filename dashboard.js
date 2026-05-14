import { db,auth }
from "./firebase.js";

import {

    collection,
    getDocs,
    deleteDoc,
    doc

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// Elements
const recentFiles =
document.getElementById("recentFiles");

const totalDocs =
document.getElementById("totalDocs");

const storageUsed =
document.getElementById("storageUsed");

const categoryCount =
document.getElementById("categoryCount");


// Files Array
let uploadedFiles = [];


// Load Documents
async function loadDocuments(){

    recentFiles.innerHTML =
    "Loading...";

   const q = query(

    collection(db, "documents"),

    where(
        "uid",
        "==",
        auth.currentUser.uid
    )

);

const querySnapshot =
await getDocs(q);

    uploadedFiles = [];

    querySnapshot.forEach((docItem) => {

        uploadedFiles.push({

            firestoreId: docItem.id,

            ...docItem.data()

        });

    });

    updateStats();

    renderFiles(uploadedFiles);

}


// Update Stats
function updateStats(){

    totalDocs.innerHTML =
    uploadedFiles.length;

    const categories =
    new Set();

    uploadedFiles.forEach(file => {

        categories.add(file.category);

    });

    categoryCount.innerHTML =
    categories.size;

    storageUsed.innerHTML =
    `${uploadedFiles.length * 2} MB`;

}


// Render Files
function renderFiles(files){

    recentFiles.innerHTML = "";

    if(files.length === 0){

        recentFiles.innerHTML =
        `<p>No Documents Found</p>`;

        return;

    }

    files.reverse().forEach(file => {

        recentFiles.innerHTML += `

        <div class="file-card">

            <div class="file-info">

                <i class="fa-solid fa-file"></i>

                <div>

                    <h4>${file.name}</h4>

                    <p>
                        ${file.category}
                        •
                        ${file.subcategory}
                    </p>

                    <p>
                        ${file.uploadedAt}
                    </p>

                </div>

            </div>

            <div class="file-actions">

                <a
                href="${file.driveURL}"
                target="_blank">

                    <button class="btn-primary">
                        View
                    </button>

                </a>

                <button
                class="btn-primary delete-btn"

                onclick="deleteFile(
                    '${file.firestoreId}',
                    '${file.driveFileId}'
                )">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}


// Filter Files
window.filterFiles = function(category){

    const filterBtns =
    document.querySelectorAll(".filter-btn");

    filterBtns.forEach(btn => {

        btn.classList.remove(
            "active-filter"
        );

    });

    event.target.classList.add(
        "active-filter"
    );

    if(category === "All"){

        renderFiles(uploadedFiles);

        return;

    }

    const filteredFiles =
    uploadedFiles.filter(file =>

        file.category === category

    );

    renderFiles(filteredFiles);

}


// Delete File
window.deleteFile = async function(

    firestoreId,
    driveFileId

){

    const confirmDelete =
    confirm(
        "Delete this document?"
    );

    if(!confirmDelete){

        return;

    }

    try{

        const tokenClient =

        google.accounts.oauth2
        .initTokenClient({

            client_id:
"382550327110-6gdk9j08j37l60kmbp6v86sebc6g8l5a.apps.googleusercontent.com",

            scope:
"https://www.googleapis.com/auth/drive.file",

            callback: async (tokenResponse) => {

                const accessToken =
                tokenResponse.access_token;


                // Delete from Google Drive
                await fetch(

`https://www.googleapis.com/drive/v3/files/${driveFileId}`,

                    {

                        method: "DELETE",

                        headers: {

                            Authorization:
                            `Bearer ${accessToken}`

                        }

                    }

                );


                // Delete Firestore Doc
                await deleteDoc(

                    doc(
                        db,
                        "documents",
                        firestoreId
                    )

                );


                alert(
                    "Document Deleted 🔥"
                );

                location.reload();

            }

        });


        tokenClient.requestAccessToken();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}


// Start
loadDocuments();