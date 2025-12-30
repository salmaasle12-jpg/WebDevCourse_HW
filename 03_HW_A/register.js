// Handle register form submission
document.getElementById("registerForm").addEventListener("submit", registerUser);

function registerUser(event) {
  event.preventDefault(); // Prevent page reload

  // Get user input values
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const firstName = document.getElementById("firtsName").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();

  // Validate password strength
  let hasLetter = false;
  let hasNumber = false;
  let hasSpecial = false;

  for (let ch of password) {
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
      hasLetter = true;
    } else if (ch >= '0' && ch <= '9') {
      hasNumber = true;
    } else {
      hasSpecial = true;
    }
  }

  // Check password rules
  if (password.length < 6 || !hasLetter || !hasNumber || !hasSpecial) {
    showMessage("Password must contain letter, number and special character");
    return;
  }

  // Check password confirmation
  if (password !== confirmPassword) {
    showMessage("Passwords do not match");
    return;
  }
let users = JSON.parse(localStorage.getItem("users")) || [];

const exists = users.find(u => u.username === username);
if (exists) {
  alert("Username already exists");
  return;
}

users.push(user);
localStorage.setItem("users", JSON.stringify(users));

alert("Registered successfully");
window.location.href = "login.html";
}


// Display validation or server messages
function showMessage(text) {
  document.getElementById("msg").innerText = text;
}
