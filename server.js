const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

// Wczytaj lub utwórz plik
let users = [];
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Rejestracja
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email już zajęty' });
  }
  users.push({ email, password }); // w realu: zahashuj hasło!
  saveUsers();
  res.json({ success: true });
});

// Logowanie
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, email });
  } else {
    res.status(401).json({ error: 'Błędne dane' });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});