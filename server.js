// I have Deployed this backend code in glitch
const express = require("express");
const http = require("http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const WebSocket = require("ws");
const cors = require('cors');
require("dotenv").config();

const pool = new Pool({
  user: 'oss_admin',
  host: '148.72.246.179',
  database: 'neo',
  password: 'Latitude77',
  schema: "public",
  port: '5432',
});

pool.on("connect", () => { console.log("Connected to the PostgreSQL database"); });

const db = { query: (text, params) => pool.query(text, params) };

const app = express();
const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
const wss = new WebSocket.Server({ noServer: true });

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    const payload = { user: { email } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err);
          return res.status(500).json({ msg: 'Server error' });
        }
        console.log('Generated token:', token);
        res.json({ token });
      }
    )
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: 'Registration failed. Please try again later.' });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: "Failed to create token" });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/messages", async (req, res) => {
  try {
    const messagesResult = await db.query("SELECT * FROM messages ORDER BY timestamp DESC");
    res.json(messagesResult.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', async (message) => {
    const { token, text } = JSON.parse(message);
    if (!token) return;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userResult = await db.query('SELECT username ,email FROM users WHERE id = $1', [decoded.user.id]);
      const username = userResult.rows[0].username;
      const email = userResult.rows[0].email;

      const insertQuery = {
        text: 'INSERT INTO messages (username, message,email) VALUES ($1, $2, $3) RETURNING id, timestamp',
        values: [username, text,email]
      };

      const result = await db.query(insertQuery);
      const { id, timestamp } = result.rows[0];

      const newMessage = { id, username, message: text,email, timestamp };

      // Broadcast the new message to all WebSocket clients
      broadcastMessage(newMessage);

    } catch (err) {
      console.error(err.message);
    }
  });
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// HTTP server setup
server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
