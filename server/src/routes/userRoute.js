const express = require("express");
const {
  getTrendings,
  getStats,
  getUsersPollsAndQuizzes,
} = require("../controllers/userController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.get("/trendings", protect, getTrendings);
router.get("/stats", protect, getStats);
router.get("/pollsAndQuizzes", protect, getUsersPollsAndQuizzes);

module.exports = router;
