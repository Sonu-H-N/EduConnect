/* ================================================
   EDUCONNECT — MAIN SCRIPT
   Single source of truth. No duplicate functions.
   ================================================ */

/* ── Helpers ─────────────────────────────────── */

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function getInitials(name) {
  return (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ── Auth Guard ──────────────────────────────── */

function requireAuth() {
  if (!localStorage.getItem('user')) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function getUser()  { return localStorage.getItem('user') || ''; }
function getRole()  { return localStorage.getItem('role') || 'student'; }

/* ── Theme ───────────────────────────────────── */

function initTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    btn.textContent = dark ? '☀️' : '🌙';
  });
}

/* ── Sidebar helpers ─────────────────────────── */

function initSidebar() {
  const user = getUser();
  const role = getRole();

  const avatarEl = document.getElementById('sidebarAvatar');
  const nameEl   = document.getElementById('sidebarName');
  const roleEl   = document.getElementById('sidebarRole');

  if (avatarEl) avatarEl.textContent = getInitials(user);
  if (nameEl)   nameEl.textContent   = user;
  if (roleEl)   roleEl.textContent   = role;
}

/* ── Logout ──────────────────────────────────── */

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

/* ── LOGIN ───────────────────────────────────── */

function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const role     = document.getElementById('role').value;

    if (!username) {
      showToast('Please enter a username.', 'error');
      return;
    }

    localStorage.setItem('user', username);
    localStorage.setItem('role', role);
    window.location.href = 'dashboard.html';
  });
}

/* ── DASHBOARD ───────────────────────────────── */

function initDashboard() {
  if (!requireAuth()) return;
  const welcome = document.getElementById('welcome');
  if (welcome) {
    welcome.textContent = `Welcome back, ${getUser()} 👋`;
  }

  // Show role badge
  const roleBadge = document.getElementById('roleBadge');
  if (roleBadge) {
    roleBadge.textContent = getRole();
    roleBadge.className = `badge badge-${getRole() === 'teacher' ? 'blue' : 'green'}`;
  }

  // Dashboard stats
  const notes       = JSON.parse(localStorage.getItem('notes')       || '[]');
  const doubts      = JSON.parse(localStorage.getItem('doubts')      || '[]');
  const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
  const members     = JSON.parse(localStorage.getItem('members')     || '[]');

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('statNotes',       notes.length);
  set('statDoubts',      doubts.length);
  set('statAssignments', assignments.length);
  set('statMembers',     members.length);
}

/* ── DOUBTS ──────────────────────────────────── */

function addDoubt() {
  const input = document.getElementById('doubtInput');
  const text  = input.value.trim();
  if (!text) { showToast('Please enter a doubt.', 'error'); return; }

  const doubts = JSON.parse(localStorage.getItem('doubts') || '[]');
  doubts.unshift({ id: Date.now(), text, author: getUser(), date: new Date().toISOString() });
  localStorage.setItem('doubts', JSON.stringify(doubts));
  input.value = '';
  loadDoubts();
  showToast('Doubt posted!');
}

function deleteDoubt(id) {
  let doubts = JSON.parse(localStorage.getItem('doubts') || '[]');
  doubts = doubts.filter(d => d.id !== id);
  localStorage.setItem('doubts', JSON.stringify(doubts));
  loadDoubts();
  showToast('Doubt removed.', 'info');
}

function loadDoubts() {
  const list = document.getElementById('doubtList');
  if (!list) return;
  const doubts = JSON.parse(localStorage.getItem('doubts') || '[]');

  if (doubts.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">💬</div><p>No doubts posted yet. Be the first!</p></div>`;
    return;
  }

  list.innerHTML = doubts.map(d => `
    <div class="doubt-card">
      <div class="doubt-avatar">${sanitize(getInitials(d.author || '?'))}</div>
      <div style="flex:1">
        <div class="doubt-text">${sanitize(d.text)}</div>
        <div class="doubt-meta">${sanitize(d.author || 'Anonymous')} · ${formatDate(d.date)}</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="deleteDoubt(${d.id})">🗑️</button>
    </div>
  `).join('');
}

/* ── NOTES ───────────────────────────────────── */

function addNote() {
  const titleEl   = document.getElementById('noteTitle');
  const contentEl = document.getElementById('noteContent');
  const title     = titleEl.value.trim();
  const content   = contentEl.value.trim();

  if (!title || !content) { showToast('Title and content are required.', 'error'); return; }

  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.unshift({ id: Date.now(), title, content, date: new Date().toISOString() });
  localStorage.setItem('notes', JSON.stringify(notes));
  titleEl.value = '';
  contentEl.value = '';
  loadNotes();
  showToast('Note saved!');
}

function deleteNote(id) {
  let notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes = notes.filter(n => n.id !== id);
  localStorage.setItem('notes', JSON.stringify(notes));
  loadNotes();
  showToast('Note deleted.', 'info');
}

function openEditModal(id) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const note  = notes.find(n => n.id === id);
  if (!note) return;

  document.getElementById('editNoteId').value      = id;
  document.getElementById('editNoteTitle').value   = note.title;
  document.getElementById('editNoteContent').value = note.content;

  document.getElementById('editModal').classList.add('open');
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('open');
}

function saveEditNote() {
  const id      = parseInt(document.getElementById('editNoteId').value);
  const title   = document.getElementById('editNoteTitle').value.trim();
  const content = document.getElementById('editNoteContent').value.trim();

  if (!title || !content) { showToast('Both fields are required.', 'error'); return; }

  let notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const idx = notes.findIndex(n => n.id === id);
  if (idx !== -1) {
    notes[idx].title   = title;
    notes[idx].content = content;
    notes[idx].edited  = new Date().toISOString();
  }
  localStorage.setItem('notes', JSON.stringify(notes));
  closeEditModal();
  loadNotes();
  showToast('Note updated!');
}

function loadNotes() {
  const container = document.getElementById('notesList');
  if (!container) return;
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');

  if (notes.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📄</div><p>No notes yet. Add one above!</p></div>`;
    return;
  }

  container.innerHTML = `<div class="item-list">${notes.map(n => `
    <div class="note-card">
      <div class="note-body">
        <h3>${sanitize(n.title)}</h3>
        <p>${sanitize(n.content)}</p>
        <div class="note-meta">${formatDate(n.date)}${n.edited ? ' · edited' : ''}</div>
      </div>
      <div class="note-actions">
        <button class="btn btn-ghost btn-sm" onclick="openEditModal(${n.id})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteNote(${n.id})">🗑️</button>
      </div>
    </div>
  `).join('')}</div>`;
}

/* ── ASSIGNMENTS ─────────────────────────────── */

function addAssignment() {
  const titleEl = document.getElementById('assignmentTitle');
  const descEl  = document.getElementById('assignmentDesc');
  const title   = titleEl.value.trim();
  const desc    = descEl.value.trim();

  if (!title) { showToast('Assignment title is required.', 'error'); return; }

  const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
  assignments.unshift({ id: Date.now(), title, desc, done: false, date: new Date().toISOString() });
  localStorage.setItem('assignments', JSON.stringify(assignments));
  titleEl.value = '';
  descEl.value  = '';
  loadAssignments();
  showToast('Assignment added!');
}

function toggleAssignment(id) {
  let assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
  const idx = assignments.findIndex(a => a.id === id);
  if (idx !== -1) assignments[idx].done = !assignments[idx].done;
  localStorage.setItem('assignments', JSON.stringify(assignments));
  loadAssignments();
}

function deleteAssignment(id) {
  let assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
  assignments = assignments.filter(a => a.id !== id);
  localStorage.setItem('assignments', JSON.stringify(assignments));
  loadAssignments();
  showToast('Assignment removed.', 'info');
}

function loadAssignments() {
  const container = document.getElementById('assignmentList');
  if (!container) return;
  const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');

  if (assignments.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📌</div><p>No assignments yet. Add one above!</p></div>`;
    return;
  }

  container.innerHTML = `<div class="item-list">${assignments.map(a => `
    <div class="assignment-card">
      <div class="a-status ${a.done ? 'done' : 'pending'}"></div>
      <div class="a-body">
        <h3 style="${a.done ? 'text-decoration:line-through;opacity:0.5' : ''}">${sanitize(a.title)}</h3>
        ${a.desc ? `<p>${sanitize(a.desc)}</p>` : ''}
        <div class="a-meta">${formatDate(a.date)} · <span class="badge ${a.done ? 'badge-green' : 'badge-amber'}">${a.done ? 'Done' : 'Pending'}</span></div>
      </div>
      <div class="a-actions">
        <button class="btn btn-ghost btn-sm" onclick="toggleAssignment(${a.id})" title="${a.done ? 'Mark pending' : 'Mark done'}">${a.done ? '↩️' : '✅'}</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAssignment(${a.id})">🗑️</button>
      </div>
    </div>
  `).join('')}</div>`;
}

/* ── CLASSROOM ───────────────────────────────── */

function createClass() {
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  localStorage.setItem('classCode', code);
  localStorage.setItem('members', JSON.stringify([]));
  const display = document.getElementById('classCodeDisplay');
  if (display) display.textContent = code;
  showToast(`Class created! Code: ${code}`);
}

function joinClass() {
  const inputEl = document.getElementById('joinCodeInput');
  const input   = inputEl.value.trim().toUpperCase();
  const code    = localStorage.getItem('classCode');

  if (!input) { showToast('Enter a class code.', 'error'); return; }
  if (input !== code) { showToast('Invalid class code!', 'error'); return; }

  const user    = getUser() || 'Student';
  let members   = JSON.parse(localStorage.getItem('members') || '[]');

  if (members.includes(user)) { showToast('You already joined this class.', 'info'); return; }

  members.push(user);
  localStorage.setItem('members', JSON.stringify(members));
  inputEl.value = '';
  loadMembers();
  showToast(`Joined class ${code}!`);
}

function loadMembers() {
  const wrap = document.getElementById('memberList');
  if (!wrap) return;
  const members = JSON.parse(localStorage.getItem('members') || '[]');

  if (members.length === 0) {
    wrap.innerHTML = `<p style="color:var(--text-3);font-size:13px">No members yet.</p>`;
    return;
  }

  wrap.innerHTML = `<div class="members-wrap">${members.map(m => `
    <div class="member-chip">👤 ${sanitize(m)}</div>
  `).join('')}</div>`;
}

function generateAttendance() {
  const members = JSON.parse(localStorage.getItem('members') || '[]');
  if (members.length === 0) { showToast('No students in class!', 'error'); return; }

  const attendance = members.map(name => ({
    name,
    status: 'present',
    time: new Date().toISOString()
  }));

  localStorage.setItem('attendance', JSON.stringify(attendance));
  renderAttendance();
  showToast('Attendance generated!');
}

function toggleAttendance(name) {
  let attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
  const idx = attendance.findIndex(a => a.name === name);
  if (idx !== -1) {
    attendance[idx].status = attendance[idx].status === 'present' ? 'absent' : 'present';
  }
  localStorage.setItem('attendance', JSON.stringify(attendance));
  renderAttendance();
}

function renderAttendance() {
  const list = document.getElementById('attendanceList');
  if (!list) return;
  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

  if (attendance.length === 0) {
    list.innerHTML = `<p style="color:var(--text-3);font-size:13px">Click "Generate" to take attendance.</p>`;
    return;
  }

  list.innerHTML = attendance.map(s => `
    <div class="attendance-row">
      <div>
        <div class="att-name">${sanitize(s.name)}</div>
        <div class="att-time">${formatDate(s.time)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="att-badge ${s.status}">${s.status}</span>
        <button class="btn btn-ghost btn-sm" onclick="toggleAttendance('${sanitize(s.name)}')">Toggle</button>
      </div>
    </div>
  `).join('');
}

/* ── SETTINGS ────────────────────────────────── */

function initSettings() {
  const nameEl = document.getElementById('newName');
  const roleEl = document.getElementById('newRole');
  if (nameEl) nameEl.value = getUser();
  if (roleEl) roleEl.value = getRole();
}

function saveSettings() {
  const name = document.getElementById('newName').value.trim();
  const role = document.getElementById('newRole').value;

  if (!name) { showToast('Name cannot be empty.', 'error'); return; }

  localStorage.setItem('user', name);
  localStorage.setItem('role', role);
  showToast('Settings saved!');
  initSidebar();
}

function clearData() {
  if (!confirm('This will delete all your notes, doubts, and assignments. Are you sure?')) return;
  const theme = localStorage.getItem('theme');
  const user  = localStorage.getItem('user');
  const role  = localStorage.getItem('role');
  localStorage.clear();
  if (theme) localStorage.setItem('theme', theme);
  if (user)  localStorage.setItem('user', user);
  if (role)  localStorage.setItem('role', role);
  showToast('All data cleared.', 'info');
}

/* ── INIT on DOM ready ───────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLogin();
  initSidebar();
  initDashboard();
  initSettings();

  // Auto-load page-specific data
  loadDoubts();
  loadNotes();
  loadAssignments();
  loadMembers();
  renderAttendance();

  // Restore class code display on classroom page
  const codeDisplay = document.getElementById('classCodeDisplay');
  if (codeDisplay) {
    const saved = localStorage.getItem('classCode');
    if (saved) codeDisplay.textContent = saved;
  }

  // Close modal on backdrop click
  const backdrop = document.getElementById('editModal');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeEditModal();
    });
  }
});
