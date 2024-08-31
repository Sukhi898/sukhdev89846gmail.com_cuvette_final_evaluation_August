const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Email or password is incorrect", 400));
  }

  const token = getToken({ id: user.id });

  res.status(200).json({
    status: "success",
    data: { token },
  });
});

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  res.status(200).send({
    message: "Success",
    data: { user },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(
      new AppError("You are not authorized to access this resource.", 403)
    );
  }

  const token = req.headers.authorization.split(" ")[1];
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decoded.id });

  if (!user) {
    return next(new AppError("User not found", 400));
  }

  req.user = user;

  next();
});

// New: Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});
