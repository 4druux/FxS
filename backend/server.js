const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db"); // Assuming you have a db.js in a config folder
const { createServer } = require("http");
const app = express();
const PORT = process.env.PORT || 5001;
const path = require("path");

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection
console.log("Attempting MongoDB connection...");
connectDB();
console.log("MongoDB connection attempted");

// Serve uploaded files statically.  MAKE SURE THIS IS BEFORE YOUR ROUTES.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create HTTP Server
const httpServer = createServer(app);

// Routes
console.log("Setting up routes...");

// User Routes (Existing)
app.use(
  "/api/user",
  (req, res, next) => {
    console.log("Accessing /api/user");
    next();
  },
  require("./routes/authRoutes")
);

// Product Routes (NEW - Refactored)
app.use(
  "/api/product",
  (req, res, next) => {
    console.log("Accessing /api/product"); // Add a similar log for consistency
    next();
  },
  require("./routes/productRoutes") // Directly require the routes
);

// Default route for root
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Backend API");
});

// 404 Route
app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
