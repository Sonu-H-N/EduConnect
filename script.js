/* ==========================================================
   EduConnect — App Logic
   Vanilla JS, localStorage-backed, role-based (student/teacher)
   ========================================================== */

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

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
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
      showNotification("Please enter a username");
      return;
    }

    localStorage.setItem("user", username);
    localStorage.setItem("role", role);

    window.location.href = "dashboard.html";
  });
}

/* ---------- THEME ---------- */
function initTheme() {
  const toggle = document.getElementById("themeToggle");

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
}

/* ---------- SIDEBAR / DASHBOARD IDENTITY ---------- */
function initSidebarUser() {
  const avatar = document.getElementById("sidebarAvatar");
  const name = document.getElementById("sidebarName");
  const role = document.getElementById("sidebarRole");
  const user = getUser();

  if (!user) return;

  if (avatar) avatar.textContent = user.charAt(0).toUpperCase();
  if (name) name.textContent = user;
  if (role) role.textContent = getRole();
}

function initDashboard() {
  const welcome = document.getElementById("welcome");
  if (!welcome) return;
  welcome.textContent = "Welcome, " + getUser() + " 👋";
}

/* ---------- DOUBTS ---------- */
function addDoubt() {
  const input = document.getElementById("doubtInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) {
    showNotification("Type a doubt before posting");
    return;
  }

  let doubts = JSON.parse(localStorage.getItem("doubts") || "[]");
  doubts.unshift({ text, user: getUser(), time: Date.now() });
  localStorage.setItem("doubts", JSON.stringify(doubts));

  input.value = "";
  loadDoubts();
  showNotification("Doubt posted");
}

function loadDoubts() {
  const list = document.getElementById("doubtList");
  if (!list) return;

  let doubts = JSON.parse(localStorage.getItem("doubts") || "[]");
  list.innerHTML = "";

  if (doubts.length === 0) {
    list.innerHTML = '<li class="empty-state" style="display:block">No doubts posted yet — ask the first one above.</li>';
    return;
  }

  doubts.forEach((d, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${escapeHtml(d.user)}:</strong> ${escapeHtml(d.text)}</span>
      <button onclick="deleteDoubt(${i})" title="Delete">🗑️</button>
    `;
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
  const titleEl = document.getElementById("noteTitle");
  const contentEl = document.getElementById("noteContent");
  const title = titleEl.value.trim();
  const content = contentEl.value.trim();

  if (!title || !content) {
    showNotification("Add both a title and content");
    return;
  }

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.unshift({ id: Date.now(), title, content, updated: Date.now() });
  localStorage.setItem("notes", JSON.stringify(notes));

  titleEl.value = "";
  contentEl.value = "";

  loadNotes();
  showNotification("Note saved");
}

function loadNotes() {
  const container = document.getElementById("notesList");
  if (!container) return;

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  container.innerHTML = "";

  if (notes.length === 0) {
    container.innerHTML = '<div class="empty-state">No notes yet — add your first one above.</div>';
    return;
  }

  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note-card";
    div.innerHTML = `
      <h3>${escapeHtml(note.title)}</h3>
      <div class="note-meta">${formatDate(note.updated)}</div>
      <p>${escapeHtml(note.content)}</p>
      <div class="card-actions">
        <button onclick="openEditModal(${note.id})">✏️ Edit</button>
        <button onclick="deleteNote(${note.id})">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function deleteNote(id) {
  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes = notes.filter(n => n.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
  showNotification("Note deleted");
}

function openEditModal(id) {
  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const note = notes.find(n => n.id === id);
  if (!note) return;

  document.getElementById("editNoteId").value = note.id;
  document.getElementById("editNoteTitle").value = note.title;
  document.getElementById("editNoteContent").value = note.content;
  document.getElementById("editModal").classList.add("open");
}

function closeEditModal() {
  document.getElementById("editModal").classList.remove("open");
}

function saveEditNote() {
  const id = Number(document.getElementById("editNoteId").value);
  const title = document.getElementById("editNoteTitle").value.trim();
  const content = document.getElementById("editNoteContent").value.trim();

  if (!title || !content) {
    showNotification("Title and content can't be empty");
    return;
  }

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const note = notes.find(n => n.id === id);
  if (note) {
    note.title = title;
    note.content = content;
    note.updated = Date.now();
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  closeEditModal();
  loadNotes();
  showNotification("Note updated");
}

/* ---------- ASSIGNMENTS ---------- */
function addAssignment() {
  const titleEl = document.getElementById("assignmentTitle");
  const descEl = document.getElementById("assignmentDesc");
  const title = titleEl.value.trim();
  const desc = descEl.value.trim();

  if (!title) {
    showNotification("Assignment title is required");
    return;
  }

  let assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  assignments.unshift({ id: Date.now(), title, desc, done: false });
  localStorage.setItem("assignments", JSON.stringify(assignments));

  titleEl.value = "";
  descEl.value = "";

  loadAssignments();
  showNotification("Assignment added");
}

function loadAssignments() {
  const container = document.getElementById("assignmentList");
  if (!container) return;

  let assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  container.innerHTML = "";

  if (assignments.length === 0) {
    container.innerHTML = '<div class="empty-state">No assignments yet — add one above.</div>';
    return;
  }

  assignments.forEach(a => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="assignment-row">
        <div class="a-info">
          <div class="a-title ${a.done ? "done" : ""}">${escapeHtml(a.title)}</div>
          ${a.desc ? `<div class="a-desc">${escapeHtml(a.desc)}</div>` : ""}
        </div>
        <span class="tag ${a.done ? "tag-success" : "tag-pending"}">${a.done ? "Done" : "Pending"}</span>
        <button onclick="toggleAssignment(${a.id})" title="Toggle status">${a.done ? "↺" : "✓"}</button>
        <button onclick="deleteAssignment(${a.id})" title="Delete">🗑️</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function toggleAssignment(id) {
  let assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  const a = assignments.find(x => x.id === id);
  if (a) a.done = !a.done;
  localStorage.setItem("assignments", JSON.stringify(assignments));
  loadAssignments();
}

function deleteAssignment(id) {
  let assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  assignments = assignments.filter(a => a.id !== id);
  localStorage.setItem("assignments", JSON.stringify(assignments));
  loadAssignments();
  showNotification("Assignment removed");
}

/* ---------- CLASSROOM ---------- */
function createClass() {
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  localStorage.setItem("classCode", code);
  localStorage.setItem("members", JSON.stringify([getUser()]));

  const display = document.getElementById("classCodeDisplay");
  if (display) {
    display.innerHTML = `<span class="class-code">${code}</span>`;
  }
  loadMembers();
  showNotification("Class created — share the code with your students");
}

function joinClass() {
  const inputEl = document.getElementById("joinCode");
  const input = inputEl.value.trim().toUpperCase();
  const code = localStorage.getItem("classCode");

  if (!input) {
    showNotification("Enter a class code first");
    return;
  }

  if (input !== code) {
    showNotification("Invalid class code");
    return;
  }

  let members = JSON.parse(localStorage.getItem("members") || "[]");
  const user = getUser();

  if (!members.includes(user)) {
    members.push(user);
    localStorage.setItem("members", JSON.stringify(members));
  }

  inputEl.value = "";
  loadMembers();
  showNotification("Joined class");
}

function loadMembers() {
  const list = document.getElementById("memberList");
  if (!list) return;

  let members = JSON.parse(localStorage.getItem("members") || "[]");
  list.innerHTML = "";

  if (members.length === 0) {
    list.innerHTML = '<li class="empty-state" style="display:block">No members yet — create or join a class above.</li>';
    return;
  }

  members.forEach(m => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${escapeHtml(m)}</span>`;
    list.appendChild(li);
  });
}

/* ---------- ATTENDANCE ---------- */
function generateAttendance() {
  let members = JSON.parse(localStorage.getItem("members") || "[]");

  if (members.length === 0) {
    showNotification("No members to mark attendance for");
    return;
  }

  let attendance = members.map(name => ({ name, status: "Present" }));
  localStorage.setItem("attendance", JSON.stringify(attendance));
  loadAttendance();
  showNotification("Attendance sheet generated");
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

  if (attendance.length === 0) {
    list.innerHTML = '<li class="empty-state" style="display:block">No attendance sheet yet — generate one above.</li>';
    return;
  }

  attendance.forEach(a => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${escapeHtml(a.name)}</span>
      <span class="tag ${a.status === "Present" ? "tag-success" : "tag-danger"}">${a.status}</span>
      <button onclick="toggleAttendance('${escapeJs(a.name)}')">Toggle</button>
    `;
    list.appendChild(li);
  });
}

function exportPDF() {
  if (!window.jspdf) {
    showNotification("PDF export library failed to load");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let data = JSON.parse(localStorage.getItem("attendance") || "[]");

  if (data.length === 0) {
    showNotification("No attendance data to export");
    return;
  }

  doc.setFontSize(16);
  doc.text("Attendance Report", 20, 20);
  doc.setFontSize(11);
  doc.text(`Class code: ${localStorage.getItem("classCode") || "—"}`, 20, 28);

  let y = 42;
  data.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.name} — ${item.status}`, 20, y);
    y += 9;
  });

  doc.save("attendance.pdf");
  showNotification("Attendance PDF downloaded");
}

/* ---------- VIDEO ---------- */
let localStream = null;

async function startVideo() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const video = document.getElementById("localVideo");
    if (video) video.srcObject = localStream;
  } catch (err) {
    showNotification("Camera access denied");
    console.error(err);
  }
}

function stopVideo() {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
    const video = document.getElementById("localVideo");
    if (video) video.srcObject = null;
  }
}

/* ---------- CHAT ---------- */
let chatPollInterval = null;

function sendMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  let chats = JSON.parse(localStorage.getItem("chat") || "[]");
  chats.push({ user: getUser(), text: msg, time: Date.now() });
  localStorage.setItem("chat", JSON.stringify(chats));

  showNotification("Message sent");
  browserNotification(msg);

  input.value = "";
  loadMessages();
}

function loadMessages() {
  const box = document.getElementById("chatMessages");
  if (!box) return;

  let chats = JSON.parse(localStorage.getItem("chat") || "[]");
  box.innerHTML = "";

  chats.forEach(c => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${escapeHtml(c.user)}:</b> ${escapeHtml(c.text)}`;
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

/* ---------- SETTINGS ---------- */
function saveSettings() {
  const nameEl = document.getElementById("newName");
  const roleEl = document.getElementById("newRole");
  const name = nameEl.value.trim();
  const role = roleEl.value;

  if (!name) {
    showNotification("Enter a name");
    return;
  }

  localStorage.setItem("user", name);
  localStorage.setItem("role", role);

  initSidebarUser();
  nameEl.value = "";
  showNotification("Settings saved");
}

function clearData() {
  const user = getUser();
  const role = getRole();
  const theme = localStorage.getItem("theme");

  localStorage.clear();

  // Preserve identity and theme — "clear data" wipes content, not the session
  if (user) localStorage.setItem("user", user);
  if (role) localStorage.setItem("role", role);
  if (theme) localStorage.setItem("theme", theme);

  showNotification("All data cleared");
  setTimeout(() => window.location.reload(), 600);
}

/* ---------- NOTIFICATIONS ---------- */
function showNotification(message) {
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.innerText = message;
  document.body.appendChild(notif);

  setTimeout(() => notif.remove(), 3000);
}

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function browserNotification(text) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("EduConnect 🔔", { body: text });
  }
}

/* ---------- HELPERS ---------- */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeJs(str) {
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initTheme();

  // Pages other than the login screen require an active session
  if (!document.getElementById("loginForm")) {
    requireAuth();
  }

  initSidebarUser();
  initDashboard();

  loadDoubts();
  loadNotes();
  loadAssignments();
  loadMembers();
  loadAttendance();
  loadMessages();

  requestNotificationPermission();

  // Poll chat for "live" updates within the same browser session
  if (document.getElementById("chatMessages")) {
    chatPollInterval = setInterval(loadMessages, 2000);
  }
});
