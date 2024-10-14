const catchAsync = require("../utils/catchAsync");

exports.getUserChats = catchAsync(async (req, res, next) => {
  const user = req.user;
  const chatData = "Contains user chat data";
  console.log(user);
  res.status(200).json({
    status: "success",
    data: {
      user,
      chatData,
    },
  });
});
