const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const ROOT_DIR = path.join(__dirname, "..");


const USERS_FILE = path.join(__dirname, "users.json");


app.use(express.static(ROOT_DIR));

// ================= USERS FUNCTIONS =================
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ================= HOME =================
app.get("/", (req, res) => {
  res.sendFile(path.join(ROOT_DIR, "index.html"));
});

// ================= REGISTER =================
app.post("/register", (req, res) => {
  const { username, password, image } = req.body;

  if (!username || !password || !image) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const users = readUsers();
  const exists = users.find(u => u.username === username);

  if (exists) {
    return res.status(400).json({ error: "User already exists" });
  }

  users.push({ username, password, image });
  saveUsers(users);

  res.json({ message: "Registered successfully" });
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  res.json({
    username: user.username,
    image: user.image
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
