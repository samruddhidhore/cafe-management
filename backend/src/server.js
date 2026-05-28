const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});