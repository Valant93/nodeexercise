const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
require("dotenv").config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    res.status(201).json({ msg: "Signup successful. Now you can log in." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const payload = { id: user.rows[0].id, username: user.rows[0].username };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

    await db.query("UPDATE users SET token = $1 WHERE id = $2", [
      token,
      user.rows[0].id,
    ]);

    res.json({
      token: `Bearer ${token}`,
      id: user.rows[0].id,
      username: user.rows[0].username,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
