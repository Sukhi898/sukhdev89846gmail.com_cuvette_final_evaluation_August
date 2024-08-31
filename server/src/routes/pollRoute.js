const express = require("express");
const {
  getPoll,
  addPoll,
  getUsersPolls,
  deletePoll,
  updatePoll,
  attemptPoll,
} = require("../controllers/pollController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, addPoll).get(protect, getUsersPolls);

router
  .route("/:id")
  .get(getPoll)
  .patch(protect, updatePoll)
  .delete(protect, deletePoll);

router.route("/attempt/:id").patch(attemptPoll);

module.exports = router;
