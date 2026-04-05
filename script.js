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