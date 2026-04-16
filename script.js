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