// Load notes when page loads
document.addEventListener("DOMContentLoaded", loadNotes);

// Function to add a note
function addNote() {
  const title = document.getElementById("noteTitle").value;
  const link = document.getElementById("noteLink").value;

  if (title === "" || link === "") {
    alert("Please fill all fields!");
    return;
  }

  const note = {
    title: title,
    link: link
  };

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(note);

  localStorage.setItem("notes", JSON.stringify(notes));

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteLink").value = "";

  loadNotes();
}

// Function to load notes
function loadNotes() {
  const notesList = document.getElementById("notesList");

  if (!notesList) return;

  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note-card");

    noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <a href="${note.link}" target="_blank">View Notes</a>
      <button onclick="deleteNote(${index})">Delete</button>
    `;

    notesList.appendChild(noteDiv);
  });
}

// Function to delete note
function deleteNote(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  notes.splice(index, 1);

  localStorage.setItem("notes", JSON.stringify(notes));

  loadNotes();
}
// LOAD DOUBTS
document.addEventListener("DOMContentLoaded", loadDoubts);

// ADD DOUBT
function addDoubt() {
  const input = document.getElementById("doubtInput").value;

  if (input === "") {
    alert("Please enter a doubt!");
    return;
  }

  let doubts = JSON.parse(localStorage.getItem("doubts")) || [];

  doubts.push({
    question: input,
    replies: []
  });

  localStorage.setItem("doubts", JSON.stringify(doubts));

  document.getElementById("doubtInput").value = "";

  loadDoubts();
}

// LOAD DOUBTS FUNCTION
function loadDoubts() {
  const doubtList = document.getElementById("doubtList");

  if (!doubtList) return;

  let doubts = JSON.parse(localStorage.getItem("doubts")) || [];

  doubtList.innerHTML = "";

  doubts.forEach((doubt, index) => {
    const div = document.createElement("div");
    div.classList.add("doubt-card");

    let repliesHTML = "";
    doubt.replies.forEach(reply => {
      repliesHTML += `<p class="reply">💬 ${reply}</p>`;
    });

    div.innerHTML = `
      <h3>${doubt.question}</h3>

      <div class="replies">
        ${repliesHTML}
      </div>

      <input type="text" placeholder="Write a reply..." id="reply-${index}">
      <button onclick="addReply(${index})">Reply</button>
      <button onclick="deleteDoubt(${index})">Delete</button>
    `;

    doubtList.appendChild(div);
  });
}

// ADD REPLY
function addReply(index) {
  const replyInput = document.getElementById(`reply-${index}`).value;

  if (replyInput === "") return;

  let doubts = JSON.parse(localStorage.getItem("doubts")) || [];

  doubts[index].replies.push(replyInput);

  localStorage.setItem("doubts", JSON.stringify(doubts));

  loadDoubts();
}

// DELETE DOUBT
function deleteDoubt(index) {
  let doubts = JSON.parse(localStorage.getItem("doubts")) || [];

  doubts.splice(index, 1);

  localStorage.setItem("doubts", JSON.stringify(doubts));

  loadDoubts();
}
// LOAD ASSIGNMENTS
document.addEventListener("DOMContentLoaded", loadAssignments);

// ADD ASSIGNMENT
function addAssignment() {
  const title = document.getElementById("assignmentTitle").value;
  const desc = document.getElementById("assignmentDesc").value;

  if (title === "" || desc === "") {
    alert("Please fill all fields!");
    return;
  }

  let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

  assignments.push({
    title: title,
    desc: desc
  });

  localStorage.setItem("assignments", JSON.stringify(assignments));

  document.getElementById("assignmentTitle").value = "";
  document.getElementById("assignmentDesc").value = "";

  loadAssignments();
}

// LOAD ASSIGNMENTS
function loadAssignments() {
  const list = document.getElementById("assignmentList");

  if (!list) return;

  let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

  list.innerHTML = "";

  assignments.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("note-card");

    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <button onclick="deleteAssignment(${index})">Delete</button>
    `;

    list.appendChild(div);
  });
}

// DELETE ASSIGNMENT
function deleteAssignment(index) {
  let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

  assignments.splice(index, 1);

  localStorage.setItem("assignments", JSON.stringify(assignments));

  loadAssignments();
}
// THEME SYSTEM
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("themeToggle");

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.textContent = "☀️";
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️";
      } else {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "🌙";
      }
    });
  }
});
// CREATE CLASS (Teacher)
function createClass() {
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();

  localStorage.setItem("classCode", code);
  localStorage.setItem("members", JSON.stringify([]));

  document.getElementById("classCodeDisplay").innerText = "Class Code: " + code;
}

// JOIN CLASS (Student)
function joinClass() {
  const inputCode = document.getElementById("classCodeInput").value;
  const savedCode = localStorage.getItem("classCode");

  if (inputCode !== savedCode) {
    alert("Invalid Class Code!");
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
    li.innerText = m;
    list.appendChild(li);
  });
}

// AUTO LOAD
document.addEventListener("DOMContentLoaded", loadMembers);
// SEND MESSAGE
function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value;

  if (message === "") return;

  const user = localStorage.getItem("user") || "User";

  let chats = JSON.parse(localStorage.getItem("chats")) || [];

  chats.push({
    user: user,
    message: message,
    time: new Date().toLocaleTimeString()
  });

  localStorage.setItem("chats", JSON.stringify(chats));

  input.value = "";

  loadMessages();
}

// LOAD MESSAGES
function loadMessages() {
  const chatBox = document.getElementById("chatMessages");

  if (!chatBox) return;

  let chats = JSON.parse(localStorage.getItem("chats")) || [];

  chatBox.innerHTML = "";

  chats.forEach(chat => {
    const div = document.createElement("div");
    div.classList.add("chat-message");

    div.innerHTML = `
      <strong>${chat.user}</strong>: ${chat.message} 
      <span class="time">${chat.time}</span>
    `;

    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

// AUTO REFRESH (simulate live chat)
setInterval(loadMessages, 1000);

// LOAD ON PAGE OPEN
document.addEventListener("DOMContentLoaded", loadMessages);
let localStream;
let peerConnection;

const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

// START CAMERA
async function startCall() {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });

  document.getElementById("localVideo").srcObject = localStream;

  peerConnection = new RTCPeerConnection(servers);

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = event => {
    document.getElementById("remoteVideo").srcObject = event.streams[0];
  };
}

// CREATE OFFER
async function callUser() {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  localStorage.setItem("offer", JSON.stringify(offer));
  alert("Offer created! Open another tab to join.");
}

// ANSWER CALL (AUTO CHECK)
setInterval(async () => {
  if (!peerConnection) return;

  const offer = JSON.parse(localStorage.getItem("offer"));

  if (offer && !peerConnection.currentRemoteDescription) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    localStorage.setItem("answer", JSON.stringify(answer));
  }

  const answer = JSON.parse(localStorage.getItem("answer"));

  if (answer && !peerConnection.currentRemoteDescription) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }
}, 2000);

// END CALL
function endCall() {
  if (peerConnection) peerConnection.close();

  document.getElementById("localVideo").srcObject = null;
  document.getElementById("remoteVideo").srcObject = null;

  localStorage.removeItem("offer");
  localStorage.removeItem("answer");
}
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const role = document.querySelector('input[name="role"]:checked');
    const username = document.getElementById("username").value;

    if (!role) {
      alert("Select role!");
      return;
    }

    localStorage.setItem("user", username);
    localStorage.setItem("role", role.value);

    // 🔥 REDIRECT FIX
    window.location.href = "dashboard.html";
  });
}
// LOAD PROFILE
document.addEventListener("DOMContentLoaded", loadProfile);

function loadProfile() {
  const name = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const nameEl = document.getElementById("profileName");
  const roleEl = document.getElementById("profileRole");

  if (nameEl) nameEl.textContent = name || "Guest";
  if (roleEl) roleEl.textContent = role || "Student";
}

// UPDATE PROFILE
function updateProfile() {
  const newName = document.getElementById("editName").value;

  if (newName === "") return;

  localStorage.setItem("user", newName);

  loadProfile();

  document.getElementById("editName").value = "";
}
// SAVE SETTINGS
function saveSettings() {
  const name = document.getElementById("newName").value;
  const role = document.getElementById("newRole").value;

  if (name !== "") {
    localStorage.setItem("user", name);
  }

  localStorage.setItem("role", role);

  alert("Settings saved!");
}

// CLEAR ALL DATA
function clearData() {
  if (confirm("Are you sure? This will delete all data!")) {
    localStorage.clear();
    window.location.href = "index.html";
  }
}
// AUTO ACTIVE MENU
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar a");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});
// LOADER
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.transition = "0.5s";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);

  }, 800); // delay for effect
});
// GENERATE ATTENDANCE LIST
function generateAttendance() {
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
  const container = document.getElementById("attendanceList");
  if (!container) return;

  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  container.innerHTML = "";

  attendance.forEach((student, index) => {
    const div = document.createElement("div");
    div.classList.add("attendance-item");

    div.innerHTML = `
      <strong>${student.name}</strong><br>

      // MARK PRESENT
function markPresent(index) {
  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  attendance[index].status = "Present";
  attendance[index].presentCount = (attendance[index].presentCount || 0) + 1;
  attendance[index].totalClasses = (attendance[index].totalClasses || 0) + 1;

  localStorage.setItem("attendance", JSON.stringify(attendance));
  loadAttendance();
}

// MARK ABSENT
function markAbsent(index) {
  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  attendance[index].status = "Absent";
  attendance[index].totalClasses = (attendance[index].totalClasses || 0) + 1;

  localStorage.setItem("attendance", JSON.stringify(attendance));
  loadAttendance();
}
      <p>Status: ${student.status}</p>
      <small>${student.time}</small>
    `;

    container.appendChild(div);
  });
}

// MARK PRESENT
function markPresent(index) {
  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  attendance[index].status = "Present";
  attendance[index].time = new Date().toLocaleString();

  localStorage.setItem("attendance", JSON.stringify(attendance));
  loadAttendance();
}

// MARK ABSENT
function markAbsent(index) {
  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  attendance[index].status = "Absent";
  attendance[index].time = new Date().toLocaleString();

  localStorage.setItem("attendance", JSON.stringify(attendance));
  loadAttendance();
}

// AUTO LOAD
document.addEventListener("DOMContentLoaded", loadAttendance);
// EXPORT PDF
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  if (attendance.length === 0) {
    alert("No attendance data!");
    return;
  }

  doc.setFontSize(16);
  doc.text("EduConnect - Attendance Report", 20, 20);

  let y = 30;

  attendance.forEach((student, index) => {
    doc.setFontSize(12);
    doc.text(
      `${index + 1}. ${student.name} - ${student.status} - ${student.time}`,
      20,
      y
    );
    y += 10;
  });

  doc.save("attendance.pdf");
}function loadAttendance() {
  const container = document.getElementById("attendanceList");
  if (!container) return;

  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  container.innerHTML = "";

  attendance.forEach((student, index) => {
    let percent = 0;

    if (student.totalClasses) {
      percent = Math.round(
        (student.presentCount / student.totalClasses) * 100
      );
    }

    const div = document.createElement("div");
    div.classList.add("attendance-item");

    div.innerHTML = `
      <strong>${student.name}</strong><br>

      <button onclick="markPresent(${index})">✅</button>
      <button onclick="markAbsent(${index})">❌</button>

      <p>Status: ${student.status}</p>
      <p>Attendance: ${percent}% 📊</p>
    `;

    container.appendChild(div);
  });
}
// SHOW USER NAME
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");

  const greeting = document.getElementById("userGreeting");
  if (greeting) {
    greeting.textContent = user ? "Welcome, " + user : "Welcome!";
  }
});