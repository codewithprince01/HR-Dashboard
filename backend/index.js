const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("./src/db");
const path = require('path');
require("dotenv").config();

const userRouter = require("./src/routes/user.routes");
const hrRoutes = require('./src/routes/hr.routes');

const app = express();
const port = process.env.PORT || 8000;

// Enhanced CORS configuration
app.use(
  cors({
    origin: process.env.VITE_API_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies to be sent
    exposedHeaders: ["set-cookie"] // Expose cookies to frontend
  })
);

// Essential middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/users", userRouter);
app.use('/api', hrRoutes);

// Database connection
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("Database connection failed", err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});