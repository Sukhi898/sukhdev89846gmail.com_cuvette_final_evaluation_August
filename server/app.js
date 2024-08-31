const express = require("express");
const cors = require("cors");
const authRouter = require("./src/routes/authRoute");
const quizRouter = require("./src/routes/quizRoute");
const pollRouter = require("./src/routes/pollRoute");
const userRouter = require("./src/routes/userRoute");
const globalErrorHandler = require("./src/controllers/errorController");

const app = express();

// List of allowed origins
const allowedOrigins = ["http://localhost:5000", "http://localhost:5173"];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options("*", cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Define routes
app.get("/", (req, res) => {
  res.status(200).json("Welcome to the quiz server! 🚀");
});

// Use route prefixes
app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/polls", pollRouter);
app.use("/api/users", userRouter);

// Handle unknown routes
app.all("*", (req, res) => {
  res.sendStatus(404);
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
