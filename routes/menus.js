const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT 
      m.id,
      m.name AS menu_name,
      m.price,
      r.name AS restaurant_name,
      r.location
    FROM tbl_menus m
    JOIN tbl_restaurants r ON m.restaurant_id = r.id
  `);

  res.json(rows);
});

module.exports = router;
