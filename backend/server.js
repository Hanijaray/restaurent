require("dotenv").config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const menuRoutes = require("./routes/menuRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const billRoutes = require("./routes/billRoutes");
const customerRoutes = require("./routes/customerRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");  
const groceryCategoryRoutes = require("./routes/groceryCategoryRoutes");
const groceryRoutes = require("./routes/groceryRoutes");
const usedGroceryRoutes = require("./routes/usedGroceryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes"); // Ensure correct path
const workerRoutes = require("./routes/workerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addGroceryRoutes = require("./routes/addGroceryRoutes");
const smsRoutes =require("./routes/smsRoutes");



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", menuRoutes);
app.use("/api", categoryRoutes);
app.use("/api", billRoutes);
app.use("/api", customerRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", groceryCategoryRoutes);
app.use("/api", groceryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes); // This must match the frontend request
app.use("/api", workerRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/used-grocery", usedGroceryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", addGroceryRoutes);
app.use("/api", smsRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

























