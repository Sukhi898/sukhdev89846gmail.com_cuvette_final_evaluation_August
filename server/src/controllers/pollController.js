const Poll = require("../model/pollModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getPoll = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const poll = await Poll.findById(id);

  if (!poll) {
    return next(new AppError("Poll not found", 404));
  }

  poll.impressions += 1;
  poll.save();

  res.status(200).json({
    satatus: "success",
    data: { poll },
  });
});

exports.getUsersPolls = catchAsync(async (req, res, next) => {
  const polls = await Poll.find({ createdBy: req.user.id });

  res.status(200).json({
    status: "success",
    results: polls.length,
    data: { polls },
  });
});

exports.addPoll = catchAsync(async (req, res, next) => {
  const { name, questions } = req.body;

  if (!name || !questions) {
    return next(new AppError("Name and questions must be provided", 400));
  }

  const poll = await Poll.create({
    name,
    questions,
    createdBy: req.user.id,
  });

  res.status(200).json({
    status: "success",
    data: { poll },
  });
});

exports.updatePoll = catchAsync(async (req, res, next) => {
  const { name, questions } = req.body;
  const { id } = req.params;
  console.log(questions);

  const poll = await Poll.findOneAndUpdate(
    {
      _id: id,
      createdBy: req.user._id,
    },
    { name, questions },
    { new: true }
  );

  if (!poll) {
    return next(
      new AppError("Poll not found, or you dont't have permission to edit it")
    );
  }

  res.status(200).json({
    status: "success",
    message: { poll },
  });
});

exports.attemptPoll = catchAsync(async (req, res, next) => {
  const { results } = req.body;
  const { id } = req.params;

  if (!results) {
    return next(new AppError("Please provide results", 400));
  }

  const poll = await Poll.findById(id);

  if (!poll) {
    return next(new AppError("Poll not found", 404));
  }

  results.forEach((el) => {
    // eslint-disable-next-line eqeqeq
    const question = poll.questions.find((q) => q._id == el.questionId);

    if (!question) {
      return next(new AppError("Question is not present", 400));
    }

    const index = el.selectedOption;

    if (question.options.length <= index) {
      return next(new AppError("Index out of range", 400));
    }

    question.options[el.selectedOption].votes += 1;
  });

  poll.save();

  res.status(200).json({
    status: "success",
    data: { poll },
  });
});

exports.deletePoll = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const poll = await Poll.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });

  if (!poll) {
    return next(
      new AppError(
        "No poll found with this id, or you don't have permission to delete it.",
        404
      )
    );
  }

  res.status(204).json({
    status: "success",
  });
});
