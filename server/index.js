const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app"); // Ensure this path is correct

dotenv.config();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception 💥", err);
  process.exit(1);
});

async function startServer() {
  try {
    // Connect to MongoDB without deprecated options
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB ✅");

    const port = process.env.PORT || 5000; // Default port 5000 or use environment variable

    // Start server and handle port conflicts
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection 💥", err);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.error("Error connecting to DB", err);
    process.exit(1);
  }
}

// Start the server
startServer();
