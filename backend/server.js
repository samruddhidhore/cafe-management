const app = require('./app');

const PORT = 5000;

app.use(cors());
app.use(express.json());

const orderRoutes = require("./routes/orderRoutes");
const billRoutes = require("./routes/billRoutes");

app.use("/api/orders", orderRoutes);
app.use('/api/bill', billRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});