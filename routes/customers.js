const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  const [rows] = await db.query("SELECT id, username, fullname FROM tbl_customers");
  res.json(rows);
});

module.exports = router;
