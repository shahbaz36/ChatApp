const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new AppError("0 users found", 500));
  }

  res.status(201).json({
    status: "created",
    data: {
      users,
    },
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.updateMe = catchAsync(async function (req, res, next) {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("Can't change password via this Route", 400));
  }

  const filteredBody = filterObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

//Deleting User
exports.deleteMe = catchAsync(async function (req, res, next) {
  const user = await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(200).json({
    status: "success",
    data: null,
  });
});
