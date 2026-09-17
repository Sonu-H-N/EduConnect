/* ==========================================================
    EduConnect — App Logic
    Vanilla JS, localStorage-backed, role-based (student/teacher)
    ========================================================== */

const VALID_ROLES = new Set(["student", "teacher"]);

function safeJsonGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined || raw === "") {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return parsed === null ? fallback : parsed;
  } catch (error) {
    console.warn(`EduConnect: invalid JSON in ${key}. Resetting to fallback.`, error);
    localStorage.removeItem(key);
    return fallback;
  }
}

function safeJsonSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`EduConnect: could not write ${key} to localStorage.`, error);
    return false;
  }
}

function normalizeRole(rawRole) {
  const role = String(rawRole || "student").trim().toLowerCase();
  return VALID_ROLES.has(role) ? role : "student";
}

function normalizeUser(rawUser) {
  return String(rawUser || "").trim();
}

function setSession(user, role) {
  const safeUser = normalizeUser(user);
  const safeRole = normalizeRole(role);

  if (!safeUser) {
    return false;
  }

  try {
    localStorage.setItem("user", safeUser);
    localStorage.setItem("role", safeRole);
    localStorage.setItem("session", JSON.stringify({ user: safeUser, role: safeRole }));
    return true;
  } catch (error) {
    console.warn("EduConnect: unable to create session.", error);
    return false;
  }
}

/* ---------- AUTH ---------- */
function getUser() {
  try {
    const cachedSession = JSON.parse(localStorage.getItem("session") || "{}");
    const storedUser = localStorage.getItem("user") || "";
    const user = normalizeUser(cachedSession.user || storedUser);
    return user;
  } catch (error) {
    console.warn("EduConnect: invalid session payload.", error);
    localStorage.removeItem("session");
    return normalizeUser(localStorage.getItem("user"));
  }
}

function getRole() {
  try {
    const cachedSession = JSON.parse(localStorage.getItem("session") || "{}");
    const storedRole = localStorage.getItem("role") || "student";
    return normalizeRole(cachedSession.role || storedRole);
  } catch (error) {
    console.warn("EduConnect: invalid role payload.", error);
    localStorage.removeItem("session");
    return normalizeRole(localStorage.getItem("role"));
  }
}

function requireAuth() {
  const user = getUser();
  const role = getRole();

  if (!user || !VALID_ROLES.has(role)) {
    stopChatPolling();
    const theme = localStorage.getItem("theme");
    localStorage.clear();
    if (theme) localStorage.setItem("theme", theme);
    window.location.href = "index.html";
    return false;
  }

  return true;
}

function logout() {
  stopChatPolling();
  const theme = localStorage.getItem("theme");
  localStorage.clear();
  if (theme) localStorage.setItem("theme", theme);
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

    if (!setSession(username, role)) {
      showNotification("Session could not be created");
      return;
    }

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

  let doubts = safeJsonGet("doubts", []);
  doubts.unshift({ text, user: getUser(), time: Date.now() });
  safeJsonSet("doubts", doubts);

  input.value = "";
  loadDoubts();
  showNotification("Doubt posted");
}

function loadDoubts() {
  const list = document.getElementById("doubtList");
  if (!list) return;

  let doubts = safeJsonGet("doubts", []);
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
  let doubts = safeJsonGet("doubts", []);
  doubts.splice(index, 1);
  safeJsonSet("doubts", doubts);
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

  let notes = safeJsonGet("notes", []);
  notes.unshift({ id: Date.now(), title, content, updated: Date.now() });
  safeJsonSet("notes", notes);

  titleEl.value = "";
  contentEl.value = "";

  loadNotes();
  showNotification("Note saved");
}

function loadNotes() {
  const container = document.getElementById("notesList");
  if (!container) return;

  let notes = safeJsonGet("notes", []);
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
  let notes = safeJsonGet("notes", []);
  notes = notes.filter(n => n.id !== id);
  safeJsonSet("notes", notes);
  loadNotes();
  showNotification("Note deleted");
}

function openEditModal(id) {
  let notes = safeJsonGet("notes", []);
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

  let notes = safeJsonGet("notes", []);
  const note = notes.find(n => n.id === id);
  if (note) {
    note.title = title;
    note.content = content;
    note.updated = Date.now();
    safeJsonSet("notes", notes);
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

  let assignments = safeJsonGet("assignments", []);
  assignments.unshift({ id: Date.now(), title, desc, done: false });
  safeJsonSet("assignments", assignments);

  titleEl.value = "";
  descEl.value = "";

  loadAssignments();
  showNotification("Assignment added");
}

function loadAssignments() {
  const container = document.getElementById("assignmentList");
  if (!container) return;

  let assignments = safeJsonGet("assignments", []);
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
  let assignments = safeJsonGet("assignments", []);
  const a = assignments.find(x => x.id === id);
  if (a) a.done = !a.done;
  safeJsonSet("assignments", assignments);
  loadAssignments();
}

function deleteAssignment(id) {
  let assignments = safeJsonGet("assignments", []);
  assignments = assignments.filter(a => a.id !== id);
  safeJsonSet("assignments", assignments);
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

  let members = safeJsonGet("members", []);
  const user = getUser();

  if (!members.includes(user)) {
    members.push(user);
    safeJsonSet("members", members);
  }

  inputEl.value = "";
  loadMembers();
  showNotification("Joined class");
}

function loadMembers() {
  const list = document.getElementById("memberList");
  if (!list) return;

  let members = safeJsonGet("members", []);
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
  let members = safeJsonGet("members", []);

  if (members.length === 0) {
    showNotification("No members to mark attendance for");
    return;
  }

  let attendance = members.map(name => ({ name, status: "Present" }));
  safeJsonSet("attendance", attendance);
  loadAttendance();
  showNotification("Attendance sheet generated");
}

function toggleAttendance(name) {
  let attendance = safeJsonGet("attendance", []);
  attendance.forEach(a => {
    if (a.name === name) {
      a.status = a.status === "Present" ? "Absent" : "Present";
    }
  });
  safeJsonSet("attendance", attendance);
  loadAttendance();
}

function loadAttendance() {
  const list = document.getElementById("attendanceList");
  if (!list) return;

  let attendance = safeJsonGet("attendance", []);
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

  let data = safeJsonGet("attendance", []);

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

function stopChatPolling() {
  if (chatPollInterval) {
    clearInterval(chatPollInterval);
    chatPollInterval = null;
  }
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  let chats = safeJsonGet("chat", []);
  chats.push({ user: getUser(), text: msg, time: Date.now() });
  safeJsonSet("chat", chats);

  showNotification("Message sent");
  browserNotification(msg);

  input.value = "";
  loadMessages();
}

function loadMessages() {
  const box = document.getElementById("chatMessages");
  if (!box) return;

  let chats = safeJsonGet("chat", []);
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
  const role = normalizeRole(roleEl.value);

  if (!name) {
    showNotification("Enter a name");
    return;
  }

  if (!setSession(name, role)) {
    showNotification("Invalid profile settings");
    return;
  }

  initSidebarUser();
  nameEl.value = "";
  showNotification("Settings saved");
}

function clearData() {
  const user = getUser();
  const role = getRole();
  const theme = localStorage.getItem("theme");

  localStorage.clear();

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
  div.textContent = String(str ?? "");
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
  loadNoticeBoard();

  requestNotificationPermission();

  if (document.getElementById("chatMessages")) {
    chatPollInterval = setInterval(loadMessages, 2000);
  }

  window.addEventListener("beforeunload", stopChatPolling);
});

/* =============================
   NOTICE BOARD
============================= */

function loadNoticeBoard() {
  const panel = document.getElementById("teacherPanel");
  const list = document.getElementById("noticeList");

  if (!list) return;

  let notices = safeJsonGet("notices", []);
  const role = getRole();

  if (role === "teacher" && panel) {
    panel.innerHTML = `
      <div class="panel">
        <h2>Create Notice</h2>
        <div class="input-row" style="margin-bottom:10px">
          <input id="noticeTitle" class="input-field" placeholder="Notice title">
        </div>
        <div class="input-row">
          <textarea id="noticeContent" class="input-field" placeholder="Write notice..."></textarea>
          <button class="btn btn-primary" onclick="addNotice()" style="align-self:flex-end">Publish Notice</button>
        </div>
      </div>
    `;
  } else if (panel) {
    panel.innerHTML = "";
  }

  list.innerHTML = "";

  if (notices.length === 0) {
    list.innerHTML = '<div class="empty-state">No notices posted yet.</div>';
    return;
  }

  [...notices].reverse().forEach((n, index) => {
    const noticeId = n.id ?? index;
    list.innerHTML += `
      <div class="notice-card">
        <h3>${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.content)}</p>
        <div class="notice-date">
          Posted by ${escapeHtml(n.author || "Unknown")}
          <br>
          ${escapeHtml(n.date)}
        </div>
        ${role === "teacher" ? `<div class="notice-actions"><button onclick="deleteNotice('${String(noticeId)}')">Delete</button></div>` : ""}
      </div>
    `;
  });
}

function addNotice() {
  const title = document.getElementById("noticeTitle").value.trim();
  const content = document.getElementById("noticeContent").value.trim();

  if (title === "" || content === "") {
    showNotification("Please fill all fields");
    return;
  }

  let notices = safeJsonGet("notices", []);

  notices.push({
    id: Date.now() + Math.random(),
    title,
    content,
    author: localStorage.getItem("user") || "Unknown",
    date: new Date().toLocaleString()
  });

  safeJsonSet("notices", notices);
  showNotification("📢 Notice Published");
  loadNoticeBoard();
}

function deleteNotice(id) {
  let notices = safeJsonGet("notices", []);

  const noticeIndex = notices.findIndex(n => String(n.id ?? "") === String(id));

  if (noticeIndex >= 0) {
    notices.splice(noticeIndex, 1);
    safeJsonSet("notices", notices);
    showNotification("Notice Deleted");
    loadNoticeBoard();
  }
}
