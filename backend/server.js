const app = require('./app');

const PORT = 5000;

<<<<<<< HEAD:backend/server.js
app.use(cors());
app.use(express.json());

const orderRoutes = require("./routes/orderRoutes");
const billRoutes = require("./routes/billRoutes");

app.use("/api/orders", orderRoutes);
app.use('/api/bill', billRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
=======
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
>>>>>>> menu-api:backend/src/server.js
});