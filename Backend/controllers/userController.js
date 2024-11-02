const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  var foundUsers = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });

  if (req.query.search === "") {
    foundUsers = null;
  }

  if (!foundUsers) {
    return next(new AppError("No users found", 500));
  }

  res.status(201).json({
    status: "Success",
    data: {
      foundUsers,
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
