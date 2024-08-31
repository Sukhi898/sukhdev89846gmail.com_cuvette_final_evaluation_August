const catchAsync = require("../utils/catchAsync");
const Quiz = require("../model/quizModel");
const Poll = require("../model/pollModel");

// Fetch trending quizzes and polls based on impressions
exports.getTrendings = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id });
  const polls = await Poll.find({ createdBy: req.user.id });

  const docs = [...quizzes, ...polls];

  // Sort items by impressions in descending order
  docs.sort((a, b) => (b.impressions || 0) - (a.impressions || 0));

  res.status(200).json({
    status: "success",
    results: docs.length,
    data: { docs },
  });
});

// Fetch user stats including total quizzes, polls, questions, and impressions
exports.getStats = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id });
  const polls = await Poll.find({ createdBy: req.user.id });

  const stats = {
    totalQuizzesAndPolls: quizzes.length + polls.length,
    totalQuestions: 0,
    totalImpressions: 0,
  };

  quizzes.forEach((quiz) => {
    stats.totalQuestions += quiz.questions.length || 0;
    stats.totalImpressions += quiz.impressions || 0;
  });

  polls.forEach((poll) => {
    stats.totalQuestions += poll.questions.length || 0;
    stats.totalImpressions += poll.impressions || 0;
  });

  res.status(200).json({
    status: "success",
    data: { stats },
  });
});

// Fetch all quizzes and polls created by the user, sorted by creation date
exports.getUsersPollsAndQuizzes = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find({ createdBy: req.user.id });
  const polls = await Poll.find({ createdBy: req.user.id });

  const userDocs = [...quizzes, ...polls];

  // Sort by creation date in descending order
  const docs = userDocs.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.status(200).json({
    status: "success",
    results: docs.length,
    data: { docs },
  });
});
