document.getElementById("addNoteBtn").addEventListener("click", () => {
    document.getElementById("noteModal").classList.remove("hidden");
});

document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("noteModal").classList.add("hidden");
});

document.getElementById("saveNote").addEventListener("click", () => {
    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;
    if (title && content) {
        const noteItem = document.createElement("div");
        noteItem.classList.add("p-2", "border", "rounded", "bg-gray-50");
        noteItem.innerHTML = `<strong>${title}</strong><p>${content}</p>`;
        document.getElementById("notesList").appendChild(noteItem);
        document.getElementById("noteModal").classList.add("hidden");
    }
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