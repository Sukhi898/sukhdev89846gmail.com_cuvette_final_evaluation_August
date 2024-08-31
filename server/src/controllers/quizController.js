const Quiz = require("../model/quizModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addQuiz = catchAsync(async (req, res, next) => {
  const { name, questions, timer } = req.body;

  const quiz = await Quiz.create({
    name,
    questions,
    timer,
    createdBy: req.user.id,
  });

  res.status(200).json({
    status: "success",
    data: { quiz },
  });
});

exports.getQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  console.log("sssssssssss");

  if (!quiz) {
    return next(new AppError("Quiz does not exist", 404));
  }

  quiz.impressions += 1;
  await quiz.save();

  res.status(200).json({
    status: "success",
    data: { quiz },
  });
});

exports.getUserQuizzes = catchAsync(async (req, res, next) => {
  const quizes = await Quiz.find({ createdBy: req.user.id });

  res.status(200).json({
    status: "success",
    results: quizes.length,
    data: { quizes },
  });
});

exports.deleteQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const quiz = await Quiz.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });

  if (!quiz) {
    return next(
      new AppError(
        "No quiz found with this id, or you don't have permission to delete it.",
        404
      )
    );
  }

  res.status(204).json({
    status: "success",
  });
});

exports.attemptQuiz = catchAsync(async (req, res, next) => {
  const { results } = req.body;
  console.log(results);
  let corrects = 0;

  if (!results) {
    return next(new AppError("Please provide results"));
  }

  const { id } = req.params;
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    return next(new AppError("Could not find quiz", 404));
  }

  results.forEach((el) => {
    // eslint-disable-next-line eqeqeq
    const question = quiz.questions.find((q) => q._id == el.questionId);

    if (!question) {
      return next(new AppError(`Question not found`, 400));
    }

    question.attempts += 1;

    // eslint-disable-next-line eqeqeq
    if (el.selectedOption == question.answer) {
      corrects += 1;
      question.corrects += 1;
    }
  });

  await quiz.save();

  const userResults = {
    totalQuestions: quiz.questions.length,
    corrects,
  };

  res.status(200).json({
    status: "success",
    data: { userResults },
  });
});

exports.updateQuiz = catchAsync(async (req, res, next) => {
  const { name, questions, timer } = req.body;
  const { id } = req.params;

  const quiz = await Quiz.findOneAndUpdate(
    {
      _id: id,
      createdBy: req.user._id,
    },
    { name, questions, timer },
    { new: true }
  );

  if (!quiz) {
    return next(
      new AppError("Quiz not found, or you dont't have permission to edit it")
    );
  }

  res.status(200).json({
    status: "success",
    message: { quiz },
  });
});
