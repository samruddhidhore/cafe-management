const express = require('express');
const cors = require('cors');

const adminRoutes = require("./routes/adminRoutes");
const billRoutes = require('./routes/billRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
app.use('/api/bill', billRoutes);

module.exports = app;