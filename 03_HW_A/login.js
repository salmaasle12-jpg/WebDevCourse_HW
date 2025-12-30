// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", loginUser);

function loginUser(event) {
  event.preventDefault(); // Prevent page reload

  // Get user input values
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

let users = JSON.parse(localStorage.getItem("users")) || [];

const user = users.find(
  u => u.username === username && u.password === password
);

if (!user) {
  alert("Invalid username or password");
  return;
}

sessionStorage.setItem("currentUser", JSON.stringify(user));
window.location.href = "search.html";

}

// Display error message to the user
function showMessage(text) {
  document.getElementById("msg").innerText = text;
}

