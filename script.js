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