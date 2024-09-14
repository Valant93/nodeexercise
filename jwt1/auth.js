const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../db/db');
require('dotenv').config();

const router = express.Router();


router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const payload = { id: user.rows[0].id };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' });

    await db.query('UPDATE users SET token = $1 WHERE id = $2', [token, user.rows[0].id]);

    res.json({ token: `Bearer ${token}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ message: 'You are authorized!' });
  }
);

module.exports = router;