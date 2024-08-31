const express = require("express");
const {
  addQuiz,
  getQuiz,
  getUserQuizzes,
  deleteQuiz,
  attemptQuiz,
  updateQuiz,
} = require("../controllers/quizController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, addQuiz).get(protect, getUserQuizzes);

router
  .route("/:id")
  .get(getQuiz)
  .patch(protect, updateQuiz)
  .delete(protect, deleteQuiz);

router.route("/attempt/:id").patch(attemptQuiz);

module.exports = router;
