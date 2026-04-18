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
// CREATE CLASS (Teacher)
function createClass() {
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();

  localStorage.setItem("classCode", code);
  localStorage.setItem("members", JSON.stringify([]));

  document.getElementById("classCode").textContent = "Class Code: " + code;
}

// JOIN CLASS (Student)
function joinClass() {
  const input = document.getElementById("joinCode").value;
  const code = localStorage.getItem("classCode");

  if (input !== code) {
    alert("Invalid Code!");
    return;
  }

  const user = localStorage.getItem("user") || "Student";

  let members = JSON.parse(localStorage.getItem("members")) || [];

  members.push(user);

  localStorage.setItem("members", JSON.stringify(members));

  loadMembers();
}

// LOAD MEMBERS
function loadMembers() {
  const list = document.getElementById("memberList");

  if (!list) return;

  let members = JSON.parse(localStorage.getItem("members")) || [];

  list.innerHTML = "";

  members.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    list.appendChild(li);
  });
}

// AUTO LOAD
document.addEventListener("DOMContentLoaded", loadMembers);
// MARK ATTENDANCE
function markAttendance() {
  let members = JSON.parse(localStorage.getItem("members")) || [];

  if (members.length === 0) {
    alert("No students in class!");
    return;
  }

  let attendance = members.map(name => ({
    name: name,
    status: "Present",
    time: new Date().toLocaleString()
  }));

  localStorage.setItem("attendance", JSON.stringify(attendance));

  loadAttendance();
}

// LOAD ATTENDANCE
function loadAttendance() {
  const list = document.getElementById("attendanceList");

  if (!list) return;

  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  list.innerHTML = "";

  attendance.forEach(student => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${student.name} - ${student.status} <br>
      <small>${student.time}</small>
    `;
    list.appendChild(li);
  });
}

// AUTO LOAD
document.addEventListener("DOMContentLoaded", loadAttendance);