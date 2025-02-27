const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const { createServer } = require("http");

const app = express();
const PORT = process.env.PORT || 5001;

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

// Create HTTP Server
const httpServer = createServer(app);

// Routes
console.log("Setting up routes...");

app.use(
  "/api/user",
  (req, res, next) => {
    console.log("Accessing /api/user");
    next();
  },
  require("./routes/authRoutes")
);

// Default route for root
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Backend API");
});

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
