// Get logged-in user from sessionStorage
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

// Redirect to login if no user is logged in
if (!currentUser) {
  window.location.href = "login.html";
} else {

  // Get header elements
  const nameSpan = document.getElementById("headerName");
  const welcome = document.getElementById("welcomeMsg");
  const img = document.getElementById("headerImage");

  // Display username
  if (nameSpan) {
    nameSpan.innerText = currentUser.username;
  }

  // Display welcome message
  if (welcome) {
    welcome.innerText = "Welcome, " + currentUser.username;
  }

  // Display user image or default image
  if (img) {
    const defaultImg = "https://via.placeholder.com/80";

    if (!currentUser.image || !currentUser.image.startsWith("http")) {
      img.src = defaultImg;
    } else {
      img.onerror = () => img.src = defaultImg;
      img.src = currentUser.image;
    }
  }
}

// Logout: clear session and redirect to login
function logout() {
  sessionStorage.removeItem("currentUser");
  window.location.href = "login.html";
}


