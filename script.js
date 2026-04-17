// LOGIN
const form = document.getElementById("loginForm");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const role = document.getElementById("role").value;

    localStorage.setItem("user", username);
    localStorage.setItem("role", role);

    window.location.href = "dashboard.html";
  });
}

// DASHBOARD LOAD
document.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("welcome");

  if (welcome) {
    const user = localStorage.getItem("user");
    welcome.textContent = "Welcome " + user;
  }
});

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  const welcome = document.getElementById("welcome");

  if (welcome) {
    welcome.textContent = "Welcome " + (user || "User") + " 👋";
  }
});

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
// ADD DOUBT
function addDoubt() {
  const input = document.getElementById("doubtInput");
  const doubt = input.value;

  if (doubt === "") return;

  let doubts = JSON.parse(localStorage.getItem("doubts")) || [];

  doubts.push(doubt);

  localStorage.setItem("doubts", JSON.stringify(doubts));

  input.value = "";

  loadDoubts();
}

// LOAD DOUBTS
function loadDoubts() {
  const list = document.getElementById("doubtList");

  if (!list) return;

  let doubts = JSON.parse(localStorage.getItem("doubts")) || [];

  list.innerHTML = "";

  doubts.forEach(d => {
    const li = document.createElement("li");
    li.textContent = d;
    list.appendChild(li);
  });
}

// AUTO LOAD
document.addEventListener("DOMContentLoaded", loadDoubts);
// ADD NOTE
function addNote() {
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  if (title === "" || content === "") return;

  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  notes.push({ title, content });

  localStorage.setItem("notes", JSON.stringify(notes));

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";

  loadNotes();
}

// LOAD NOTES
function loadNotes() {
  const container = document.getElementById("notesList");

  if (!container) return;

  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  container.innerHTML = "";

  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note-card";

    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>

      <button onclick="editNote(${index})">✏️ Edit</button>
      <button onclick="deleteNote(${index})">🗑️ Delete</button>
    `;

    container.appendChild(div);
  });
}

// AUTO LOAD
document.addEventListener("DOMContentLoaded", loadNotes);
// THEME TOGGLE
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");

  if (!toggle) return;

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      toggle.textContent = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      toggle.textContent = "🌙";
    }
  });
});
// DELETE NOTE
function deleteNote(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  notes.splice(index, 1);

  localStorage.setItem("notes", JSON.stringify(notes));

  loadNotes();
}
// EDIT NOTE
function editNote(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  let newTitle = prompt("Edit Title:", notes[index].title);
  let newContent = prompt("Edit Content:", notes[index].content);

  if (newTitle === null || newContent === null) return;

  notes[index].title = newTitle;
  notes[index].content = newContent;

  localStorage.setItem("notes", JSON.stringify(notes));

  loadNotes();
}
function logout() {
  localStorage.clear(); // remove all stored data
  window.location.href = "index.html"; // go back to login page
}
function logout() {
  alert("Logout clicked"); // test
  localStorage.clear();
  window.location.href = "index.html";
}