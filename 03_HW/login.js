// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", loginUser);

function loginUser(event) {
  event.preventDefault(); // Prevent page reload

  // Get user input values
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Send login request to the server
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      // Show error if login failed
      if (data.error) {
        showMessage("Username or password is incorrect");
      } else {
        // Save logged-in user and redirect
        sessionStorage.setItem("currentUser", JSON.stringify(data));
        alert("Login successful!");
        window.location.href = "search.html";
      }
    });
}

// Display error message to the user
function showMessage(text) {
  document.getElementById("msg").innerText = text;
}

