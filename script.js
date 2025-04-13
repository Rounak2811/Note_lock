
// +Add Note button
document.getElementById("addNoteBtn").addEventListener("click", () => {
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
    document.getElementById("noteModal").classList.remove("hidden");

    document.getElementById("saveNote").onclick = function () {
        const title = document.getElementById("noteTitle").value;
        const content = document.getElementById("noteContent").value;
        if (title && content) {
            saveNoteToStorage(title, content);
            document.getElementById("noteModal").classList.add("hidden");
            loadNotes();
        }
    };
});


// Close modal button
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("noteModal").classList.add("hidden");
});




let hamburger=document.querySelector('#hamburger');
let sidebar=document.querySelector('#sidebar');


hamburger.addEventListener('click',()=>{
    sidebar.classList.toggle('hidden');
    hamburger.classList.toggle('hidden');
});

document.addEventListener('click',(e)=>{
    if(e.target.id!=='hamburger' && e.target.id!=='sidebar'){
        sidebar.classList.add('hidden');
        hamburger.classList.remove('hidden');
    }
});

// Authentication logic displays the text which is to be shown in the login/signup page

function toggleAuth(){
    const title=document.getElementById('authTitle');
    const button=document.getElementById('authButton');
    const toggleText=document.querySelector("#authContainer p");

    if(title.innerText==="Login"){
        title.innerText="Sign Up";
        button.innerText="Sign Up";
        toggleText.innerText="Already have an account?Login";
    }
    else{
        title.innerText="Login";
        button.innerText="Login";
        toggleText.innerText="Don't have an account?Sign Up";
    }
}


function authenticate(){
    const username=document.getElementById('authUsername').value;
    const password=document.getElementById('authPassword').value;
    const authType=document.getElementById('authTitle').innerText;

    if(!username || !password){
        alert("Please enter both username and password");
        return;
    }

    if(authType==="Sign Up"){
        localStorage.setItem("user",JSON.stringify({username,password}));
        alert("Signup Successful! Please login to continue");
        toggleAuth();
    }
    else{
        const storedUser=JSON.parse(localStorage.getItem("user"));
        if(storedUser && storedUser.username===username && storedUser.password===password){
            alert("Login Successful!");
            document.getElementById("authContainer").classList.add("hidden");
            document.getElementById("mainContent").classList.remove("hidden");
        }
        else{
            alert("Invalid username or password");
        }
    }
}

function logout(){
    alert("Logged out successfully!");
    document.getElementById("authContainer").classList.remove("hidden");
    document.getElementById("mainContent").classList.add("hidden");
}

function saveNoteToStorage(title, content) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push({ title, content, timestamp: Date.now() });
    localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const notesList = document.getElementById("notesList");
    notesList.innerHTML = "";

    notes.forEach((note, index) => {
        const noteItem = document.createElement("div");
        noteItem.classList.add("p-2", "border", "rounded", "bg-gray-50");
        noteItem.dataset.timestamp = note.timestamp;
        noteItem.innerHTML = `
            <strong>${note.title}</strong>
            <p>${note.content}</p>
            <div class="mt-2 flex space-x-2">
                <button onclick="editNote(${index})" class="text-blue-500">✏️ Edit</button>
                <button onclick="deleteNote(${index})" class="text-red-500">🗑️ Delete</button>
            </div>
        `;
        notesList.appendChild(noteItem);
    });
}

function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
}

function editNote(index) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    const note = notes[index];
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteContent").value = note.content;
    document.getElementById("noteModal").classList.remove("hidden");

    document.getElementById("saveNote").onclick = function () {
        const updatedTitle = document.getElementById("noteTitle").value;
        const updatedContent = document.getElementById("noteContent").value;
        notes[index] = { title: updatedTitle, content: updatedContent, timestamp: Date.now() };
        localStorage.setItem("notes", JSON.stringify(notes));
        document.getElementById("noteModal").classList.add("hidden");
        loadNotes();
    };
}

function searchNotes(){
    const query=document.getElementById("searchInput").value.toLowerCase();
    const notes=document.querySelectorAll("#notesList div");

    notes.forEach(note=>{
        note.style.display=note.innerText.toLowerCase().includes(query)?"block":"none";
    });
}


function filterNotes(){
    const filter=document.getElementById("filterSelect").value;
    const notes=Array.from(document.querySelectorAll("#notesList div"));

    if(filter==="recent"){
        notes.sort((a,b)=>b.dataset.timestamp-a.dataset.timestamp);
    }
    else if(filter==="oldest"){
        notes.sort((a,b)=>a.dataset.timestamp-b.dataset.timestamp);
    }

    document.getElementById("notesList").innerHTML="";
    notes.forEach(note=>{
        document.getElementById("notesList").appendChild(note);
    });
}

// security settings:
function showSection(sectionId) {
    const sections = ['mainContent', 'securitySettings'];
    sections.forEach(id => document.getElementById(id)?.classList.add('hidden'));
    document.getElementById(sectionId)?.classList.remove('hidden');
}
// change passwords
function changePassword() {
    const newPassword = document.getElementById("newPassword").value;
    if (newPassword.length < 4) return alert("Password must be at least 4 characters.");
    let user = JSON.parse(localStorage.getItem("user"));
    user.password = newPassword;
    localStorage.setItem("user", JSON.stringify(user));
    alert("Password updated successfully!");
}
// clear all notes
function clearAllNotes() {
    if (confirm("Are you sure you want to delete all notes?")) {
        localStorage.removeItem("notes");
        loadNotes();
        alert("All notes cleared.");
    }
}

// export notes:
async function exportNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    if (notes.length === 0) {
        alert("No notes to export.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("NoteLock - Notes Backup", 10, 10);
    doc.setFontSize(12);

    let y = 20;

    notes.forEach((note, index) => {
        doc.text(`Note ${index + 1}: ${note.title}`, 10, y);
        y += 7;

        // Handle long content wrapping
        const splitContent = doc.splitTextToSize(note.content, 180);
        doc.text(splitContent, 10, y);
        y += splitContent.length * 7;

        y += 5;

        // New page if space runs out
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save("NoteLock_Notes_Backup.pdf");
}


// Delete Account:
function deleteAccount() {
    if (confirm("This will delete your account and all data. Proceed?")) {
        localStorage.clear();
        location.reload();
    }
}


