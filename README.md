# 🎓 EduConnect

> **A modern student–teacher interaction platform** built with **HTML, CSS, and Vanilla JavaScript** that streamlines classroom communication through notes sharing, assignments, announcements, attendance, classroom collaboration, live chat, and video preview.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

# 📖 Overview

EduConnect is a responsive web application designed for educational institutions to improve communication between **students and teachers**.

The platform simulates a real Learning Management System (LMS) by combining classroom management, note sharing, assignment tracking, announcements, attendance, live chat, notifications, and video support into one modern interface.

It is ideal as a **college mini project**, **final-year project**, or **portfolio project**.

---

# ✨ Features

## 🔐 Authentication

- Role-based Login (Student / Teacher)
- Session persistence using localStorage
- Protected pages
- Dynamic user profile in sidebar

---

## 📊 Dashboard

- Quick navigation cards
- Personalized welcome section
- Responsive layout
- Modern sidebar navigation

---

## 💬 Doubts Board

- Post doubts instantly
- View classroom discussions
- Delete doubts
- Stored locally

---

## 📄 Notes Management

- Add notes
- Edit notes
- Delete notes
- Timestamp for every note
- Modal-based editing

---

## 📌 Notice Board

Teachers can

- Publish announcements
- Share important notices
- Update examination schedules
- Post classroom events

Students can

- Read all notices
- View posting date
- See notice author

---

## 📝 Assignments

- Create assignments
- Track Pending / Completed status
- Delete assignments
- Responsive assignment cards

---

## 🎓 Classroom

### Classroom Management

- Create Classroom
- Join Classroom
- Unique Join Code
- Member List

### Attendance

- Generate attendance sheet
- Present / Absent toggle
- Export attendance as PDF

### Live Chat

- Classroom messaging
- Auto-refresh messages
- Chat history stored locally

### Video Preview

- Camera & microphone access
- Local video preview using getUserMedia
- Start / Stop controls

---

## 🔔 Notifications

- Animated in-app toast notifications
- Browser notification support
- Chat message alerts
- Smooth notification animations

---

## ⚙️ Settings

- Update profile
- Change role
- Theme preference
- Reset application data

---

## 🎨 Premium UI

- Modern Glassmorphism cards
- Responsive dashboard
- Dark / Light mode
- Beautiful sidebar
- Smooth animations
- Professional typography
- Mobile-friendly layout

---

# 🛠️ Technology Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Structure |
| CSS3 | Styling & Responsive Design |
| JavaScript (ES6) | Application Logic |
| localStorage | Data Persistence |
| jsPDF | Attendance PDF Export |
| Notifications API | Browser Notifications |
| WebRTC (getUserMedia) | Camera Preview |
| Google Fonts | DM Sans & DM Mono |

---

# 📂 Project Structure

```
EduConnect/
│
├── index.html
├── dashboard.html
├── doubts.html
├── notes.html
├── assignments.html
├── classroom.html
├── notice.html
├── settings.html
│
├── style.css
├── script.js
│
└── README.md
```

---

# 🚀 How to Run

## Option 1

Open

```
index.html
```

in your browser.

---

## Option 2 (Recommended)

Using VS Code

```
Right Click

↓

Open with Live Server
```

or

```bash
python -m http.server 8080
```

Visit

```
http://localhost:8080
```

---

# 💾 Data Storage

EduConnect stores data using **localStorage**.

| Storage Key | Description |
|-------------|-------------|
| user | Username |
| role | Student / Teacher |
| theme | Light / Dark |
| doubts | Doubts |
| notes | Notes |
| assignments | Assignment Data |
| notices | Notice Board |
| classCode | Classroom Code |
| members | Classroom Members |
| attendance | Attendance |
| chat | Chat Messages |

No external database is required.

---

# 📱 Responsive Design

✔ Desktop

✔ Laptop

✔ Tablet

✔ Mobile

---

# 🔒 Security

Current Version

- Frontend only
- No passwords
- No backend
- Browser-based storage

Production Upgrade Ideas

- Firebase Authentication
- Cloud Firestore
- Role-based Authorization
- Encrypted Storage

---

# 🔮 Future Enhancements

- ✅ Firebase Backend
- ✅ Real-Time Chat
- ✅ Multi-user Video Calling
- ✅ Assignment Submission
- ✅ Quiz Module
- ✅ Student Progress Analytics
- ✅ Timetable Management
- ✅ Calendar Integration
- ✅ AI Study Assistant
- ✅ Email Notifications
- ✅ Push Notifications
- ✅ File Upload System

---

# 📸 Screenshots

Add screenshots here after completing the project.

```
Login Page

Dashboard

Notice Board

Assignments

Classroom

Chat

Video Preview

Dark Mode
```

---

# 👨‍💻 Author

**Suhas H N**

**B.E. Electronics & Communication Engineering**

Passionate about Full Stack Web Development, UI Design, and Educational Technology.

GitHub:
```
https://github.com/Sonu-H-N
```

---

# ⭐ Support

If you found this project useful,

⭐ Star this repository

🍴 Fork it

📢 Share it with others

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 🩹 Changelog

**Upgrade pass**

- **Critical fix:** a stray `<a>` tag had been pasted into the middle of `script.js`, which caused a JavaScript syntax error and broke the *entire* app (login, notes, chat, everything) — removed.
- Same stray tag was also corrupting `style.css` and littered across every `.html` file in invalid positions (inside `<head>`, floating between `<head>` and `<body>`, after `</html>`) — removed everywhere.
- Notice Board is now wired into the sidebar navigation on every page (previously only reachable if you knew the URL) and added as a dashboard card.
- Rebuilt `notice.html` to use the same sidebar/theme-toggle/typography as the rest of the app — it was previously an unstyled orphan page.
- Fixed a bug where the "Create Notice" panel never appeared for teachers (`role === "Teacher"` was compared against a stored lowercase `"teacher"`).
- Notice titles/content/author are now HTML-escaped before rendering (previously the only page in the app vulnerable to stored-markup injection).
- Replaced a blocking `alert()` in the notice flow with the app's existing toast notification for consistency.
- Removed a stray editor config file (`{} settings.json`) that shouldn't have been committed.
- Notice cards now use the app's CSS variables so they respect dark mode instead of a hardcoded white background.