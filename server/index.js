const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception 💥", err);
  process.exit(1);
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB ✅");

    const port = process.env.PORT || 5000; 

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

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
