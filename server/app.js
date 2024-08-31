const express = require("express");
const cors = require("cors");
const authRouter = require("./src/routes/authRoute");
const quizRouter = require("./src/routes/quizRoute");
const pollRouter = require("./src/routes/pollRoute");
const userRouter = require("./src/routes/userRoute");
const globalErrorHandler = require("./src/controllers/errorController");

const app = express();

const allowedOrigins = ["https://quizziee-app.netlify.app/", "https://quizzie-api-zexm.onrender.com/"];

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

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("Welcome to the quiz server API");
});

app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/polls", pollRouter);
app.use("/api/users", userRouter);

app.all("*", (req, res) => {
  res.sendStatus(404);
});

app.use(globalErrorHandler);

module.exports = app;
