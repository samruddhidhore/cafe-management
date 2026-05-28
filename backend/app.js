const express = require('express');
const cors = require('cors');

const adminRoutes = require("./routes/adminRoutes");
<<<<<<< HEAD:backend/app.js
=======
const orderRoutes = require("./routes/orderRoutes")
>>>>>>> menu-api:backend/src/app.js
const billRoutes = require('./routes/billRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
<<<<<<< HEAD:backend/app.js
=======
app.use('/api/orders', orderRoutes);
>>>>>>> menu-api:backend/src/app.js
app.use('/api/bill', billRoutes);

module.exports = app;