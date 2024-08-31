const express = require("express");
const {
  login,
  register,
  getAllUsers,
} = require("../controllers/authController");

const router = express.Router();

// Route to get all users
router.get("/", getAllUsers);

router.post("/login", login);

router.post("/register", register);

module.exports = router;
