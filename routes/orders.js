const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// ====================
//  GET All Orders (NEW)
// ====================
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        o.id,
        m.name AS menu_name,
        o.quantity,
        o.price * o.quantity AS total_price,
        o.created_at
      FROM tbl_orders o
      JOIN tbl_menus m ON o.menu_id = m.id
      WHERE o.customer_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ====================
//  POST Add Order
// ====================
router.post('/', verifyToken, async (req, res) => {
  try {
    const { menu_id, quantity } = req.body;

    // ดึงราคาเมนู
    const [menu] = await db.query(
      "SELECT price FROM tbl_menus WHERE id = ?", 
      [menu_id]
    );

    if (menu.length === 0)
      return res.status(400).json({ error: "Menu not found" });

    const price = menu[0].price;

    // INSERT ลง tbl_orders
    await db.query(
      "INSERT INTO tbl_orders (customer_id, menu_id, quantity, price, status) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, menu_id, quantity, price, 'pending']
    );

    res.json({ 
      message: "Order created", 
      total_price: price * quantity 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ====================
//  GET Summary
// ====================
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.fullname AS customer_name,
        SUM(o.price * o.quantity) AS total_amount
      FROM tbl_orders o
      JOIN tbl_customers c ON o.customer_id = c.id
      WHERE o.customer_id = ?
    `, [req.user.id]);

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
