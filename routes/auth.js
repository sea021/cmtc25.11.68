const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  const { username, password, fullname } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO tbl_customers (username, password, fullname) VALUES (?, ?, ?)",
    [username, hashed, fullname]
  );

  res.json({ message: "Register successful" });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM tbl_customers WHERE username = ?",
    [username]
  );

  if (rows.length === 0)
    return res.status(400).json({ error: "Username not found" });

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ error: "Password incorrect" });

  const token = jwt.sign(
    { id: user.id, fullname: user.fullname },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

module.exports = router;
