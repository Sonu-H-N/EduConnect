# 🎓 EduConnect

> A web-based student–teacher interaction platform for doubt discussion, notes sharing, assignment tracking, and live classroom sessions — built with vanilla HTML, CSS, and JavaScript.

![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## 📸 Overview

EduConnect is a multi-page academic platform designed as a portfolio / final-year project. It models the day-to-day workflow of a classroom — asking questions, sharing notes, tracking assignments, taking attendance, and meeting live — behind a simple role-based login (Student / Teacher), with every page sharing one consistent design system.

---

## ✨ Features

### 🔐 Authentication
- Role-based login (Student / Teacher), no password required for this demo
- Session persisted in `localStorage`; protected pages redirect to login if no session exists
- Sidebar identity card shows your avatar initial, name, and role on every page

### 💬 Doubts Board
- Post a question, see it appear instantly for the whole class
- Delete your own doubts

### 📄 Notes
- Add notes with a title and free-form content (text, links, anything)
- **Edit in a modal dialog** — no disruptive browser prompts
- Delete notes, each card shows a last-updated timestamp

### 📌 Assignments
- Add a task with an optional description
- Toggle between **Pending** and **Done** with a status tag
- Delete completed or outdated assignments

### 🎓 Classroom
- **Create a class** — generates a short shareable join code
- **Join a class** by code, builds a member list
- **Attendance** — generate a sheet from current members, toggle Present/Absent per person
- **Export attendance to PDF** (via jsPDF)
- **Live chat** — polls for new messages every 2 seconds within the session
- **Video preview** — starts your camera/mic via `getUserMedia` for a local live-video panel

### ⚙️ Settings
- Update your display name and role at any time
- **Danger zone** — clear all app data (notes, doubts, assignments, classroom state) while keeping you signed in

### 🎨 Interface
- One consistent sidebar across all pages: brand mark, full navigation, identity card
- Dark mode toggle, persisted across sessions
- Toast notifications instead of `alert()` dialogs
- Status tags (Present/Absent, Pending/Done) rendered in a monospace data style for quick scanning
- Responsive layout — sidebar collapses to a top bar on small screens

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure across 7 views |
| CSS3 | Shared design system (CSS variables), dark/light themes, responsive layout |
| Vanilla JavaScript (ES6+) | All app logic, no frameworks |
| [jsPDF](https://parall.ax/products/jspdf) | Client-side attendance PDF export |
| `getUserMedia` (WebRTC) | Local camera/mic preview in Classroom |
| Notifications API | Optional browser notifications for new chat messages |
| Google Fonts — DM Sans + DM Mono | UI text and data/status labels |
| localStorage | All data persistence — users, doubts, notes, assignments, classes, attendance, chat |

---

## 📂 Project Structure

```
EduConnect/
├── index.html          # Login (role select: Student / Teacher)
├── dashboard.html       # Landing page after login, quick links to every section
├── doubts.html           # Doubts board
├── notes.html             # Notes — add, edit (modal), delete
├── assignments.html        # Assignments — add, toggle done, delete
├── classroom.html           # Create/join class, attendance, chat, live video
├── settings.html              # Profile settings + clear all data
├── script.js                   # All app logic (~520 lines)
├── style.css                    # Complete shared design system
└── README.md                     # This file
```

> **No build tools. No npm. No backend.** Open `index.html` in a browser and it works immediately.

---

## ⚙️ How to Run

### Option 1 — Open directly
```
Double-click index.html   →   Sign in, then navigate the app
```

### Option 2 — Live Server (recommended for camera/mic access)
```bash
# VS Code extension
Install "Live Server" → Right-click index.html → "Open with Live Server"

# Or with Python
python -m http.server 8080
# Then visit http://localhost:8080
```
> Camera/microphone access via `getUserMedia` requires `http://` or `https://` — most browsers block it on the `file://` protocol.

---

## 🗂️ Data Storage

All data lives in **localStorage**, scoped to whichever browser/device you use:

| Key | Contents |
|---|---|
| `user`, `role` | Current signed-in identity |
| `theme` | `dark` or `light` |
| `doubts` | Array of posted doubts |
| `notes` | Array of notes |
| `assignments` | Array of assignments with done/pending status |
| `classCode`, `members` | Active class and its member list |
| `attendance` | Generated attendance sheet |
| `chat` | Classroom chat messages |

**No data leaves your device.** This is a frontend-only demo — for a production deployment, replace localStorage with a real backend (Firebase, Supabase, or a Node.js/Express API with a database) so data syncs across users and devices.

---

## 🔮 Possible Extensions

- 🔐 Real authentication with passwords and per-user accounts
- ☁️ Backend sync (Firebase/Supabase) so classes work across multiple devices
- 📡 Real peer-to-peer video (WebRTC signaling) instead of a local-only preview
- 🔔 Push notifications for new doubts or assignment deadlines
- 📊 Teacher analytics — assignment completion rates, attendance trends

---

## 👨‍💻 Author

**Sonu H N**
Passionate about web development and building tools that make learning easier.

---

## 📜 License

This project is open-source under the MIT License.
