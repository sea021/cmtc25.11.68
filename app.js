const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/customers', require('./routes/customers'));
app.use('/menus', require('./routes/menus'));
app.use('/orders', require('./routes/orders'));

app.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:" + process.env.PORT);
});
