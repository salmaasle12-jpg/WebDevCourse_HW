const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const USERS_FILE = "./users.json";

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// REGISTER
app.post("/register", (req, res) => {
  const { username, password, image } = req.body;

  if (!username || !password || !image) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const users = readUsers();
  const exists = users.find(u => u.username === username);
  if (exists) return res.status(400).json({ error: "User exists" });

  users.push({ username, password, image });
  saveUsers(users);

  res.json({ message: "Registered successfully" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ error: "Invalid login" });

  
  res.json({ username: user.username, image: user.image });
});

app.listen(3000, () => console.log("Server running: http://localhost:3000"));
