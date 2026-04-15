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