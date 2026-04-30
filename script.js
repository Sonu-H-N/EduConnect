/* ====================================
   EDUCONNECT — CLEAN SCRIPT (FIXED)
==================================== */

/* ---------- AUTH ---------- */
function getUser() {
  return localStorage.getItem("user") || "";
}

function getRole() {
  return localStorage.getItem("role") || "student";
}

function requireAuth() {
  if (!localStorage.getItem("user")) {
    window.location.href = "index.html";
  }
}

/* ---------- LOGIN ---------- */
function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const role = document.getElementById("role").value;

    if (!username) {
      alert("Enter username!");
      return;
    }

    localStorage.setItem("user", username);
    localStorage.setItem("role", role);

    window.location.href = "dashboard.html";
  });
}

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// THEME (SAFE)
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");

  // Apply saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  if (!toggle) return;

  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggle.textContent = isDark ? "☀️" : "🌙";
  });
});

/* ---------- DASHBOARD ---------- */
function initDashboard() {
  const welcome = document.getElementById("welcome");
  if (!welcome) return;

  welcome.textContent = "Welcome " + getUser() + " 👋";
}

/* ---------- DOUBTS ---------- */
function addDoubt() {
  const input = document.getElementById("doubtInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  let doubts = JSON.parse(localStorage.getItem("doubts") || "[]");

  doubts.unshift({ text, user: getUser() });

  localStorage.setItem("doubts", JSON.stringify(doubts));

  input.value = "";
  loadDoubts();
}

function loadDoubts() {
  const list = document.getElementById("doubtList");
  if (!list) return;

  let doubts = JSON.parse(localStorage.getItem("doubts") || "[]");

  list.innerHTML = "";

  doubts.forEach((d, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${d.user}: ${d.text}
      <button onclick="deleteDoubt(${i})">🗑️</button>`;
    list.appendChild(li);
  });
}

function deleteDoubt(index) {
  let doubts = JSON.parse(localStorage.getItem("doubts") || "[]");
  doubts.splice(index, 1);
  localStorage.setItem("doubts", JSON.stringify(doubts));
  loadDoubts();
}

/* ---------- NOTES ---------- */
function addNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();

  if (!title || !content) return;

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");

  notes.unshift({ title, content });

  localStorage.setItem("notes", JSON.stringify(notes));

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";

  loadNotes();
}

function loadNotes() {
  const container = document.getElementById("notesList");
  if (!container) return;

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");

  container.innerHTML = "";

  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note-card";

    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <button onclick="editNote(${index})">✏️</button>
      <button onclick="deleteNote(${index})">🗑️</button>
    `;

    container.appendChild(div);
  });
}

function deleteNote(index) {
  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}

function editNote(index) {
  let notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const newTitle = prompt("Edit Title:", notes[index].title);
  const newContent = prompt("Edit Content:", notes[index].content);

  if (newTitle === null || newContent === null) return;

  notes[index].title = newTitle;
  notes[index].content = newContent;

  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}

/* ---------- CLASSROOM ---------- */
function createClass() {
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  localStorage.setItem("classCode", code);
  localStorage.setItem("members", JSON.stringify([]));
  alert("Class Code: " + code);
}

function joinClass() {
  const input = document.getElementById("joinCode").value;
  const code = localStorage.getItem("classCode");

  if (input !== code) {
    alert("Invalid Code!");
    return;
  }

  let members = JSON.parse(localStorage.getItem("members") || "[]");

  const user = getUser();

  if (!members.includes(user)) {
    members.push(user);
    localStorage.setItem("members", JSON.stringify(members));
  }

  loadMembers();
}

function loadMembers() {
  const list = document.getElementById("memberList");
  if (!list) return;

  let members = JSON.parse(localStorage.getItem("members") || "[]");

  list.innerHTML = "";

  members.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    list.appendChild(li);
  });
}

/* ---------- ATTENDANCE ---------- */
function generateAttendance() {
  let members = JSON.parse(localStorage.getItem("members") || "[]");

  let attendance = members.map(name => ({
    name,
    status: "Present"
  }));

  localStorage.setItem("attendance", JSON.stringify(attendance));
  loadAttendance();
}

function toggleAttendance(name) {
  let attendance = JSON.parse(localStorage.getItem("attendance") || "[]");

  attendance.forEach(a => {
    if (a.name === name) {
      a.status = a.status === "Present" ? "Absent" : "Present";
    }
  });

  localStorage.setItem("attendance", JSON.stringify(attendance));
  loadAttendance();
}

function loadAttendance() {
  const list = document.getElementById("attendanceList");
  if (!list) return;

  let attendance = JSON.parse(localStorage.getItem("attendance") || "[]");

  list.innerHTML = "";

  attendance.forEach(a => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${a.name} - ${a.status}
      <button onclick="toggleAttendance('${a.name}')">Toggle</button>
    `;
    list.appendChild(li);
  });
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initTheme();
  initDashboard();

  loadDoubts();
  loadNotes();
  loadMembers();
  loadAttendance();
});
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let data = JSON.parse(localStorage.getItem("attendance") || "[]");

  if (data.length === 0) {
    alert("No data!");
    return;
  }

  doc.setFontSize(16);
  doc.text("Attendance Report", 20, 20);

  let y = 30;

  data.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.name} - ${item.status}`, 20, y);
    y += 10;
  });

  doc.save("attendance.pdf");
}