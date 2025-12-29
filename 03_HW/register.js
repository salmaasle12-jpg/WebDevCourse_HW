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

  // Send registration data to the server
  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      image: imageUrl,
      firstName
    })
  })
    .then(res => res.json())
    .then(data => {
      // Handle server response
      if (data.error) {
        showMessage(data.error);
      } else {
        alert("Registration successful!");
        window.location.href = "login.html";
      }
    });
}

// Display validation or server messages
function showMessage(text) {
  document.getElementById("msg").innerText = text;
}
