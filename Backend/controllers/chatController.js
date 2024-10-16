const Chat = require("../models/Chat");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getUserChats = catchAsync(async (req, res, next) => {
  const user = req.user;
  const chatData = "Contains user chat data";
  console.log("Backend Request");
  res.status(200).json({
    status: "success",
    data: {
      user,
      chatData,
    },
  });
});

exports.accessChat = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    next(
      new AppError(
        "Missing user id. Please send the user id to start a Conversation",
        404
      )
    );
  }

  var chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chat = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (chat.length > 0) {
    res.status(200).json({
      status: "Success",
      data: {
        chat: chat[0],
      },
    });
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    if (!fullChat) {
      return next(new AppError("Problem while creating new Chat", 400));
    }

    res.status(201).json({ status: "created", data: { fullChat } });
  }
});
