const Chat = require("../models/Chat");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getUserChats = catchAsync(async (req, res, next) => {
  const user = req.user;

  const chatData = await Chat.find({
    users: { $elemMatch: { $eq: user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  const result = await User.populate(chatData, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
      result,
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

exports.createGroupChat = catchAsync(async (req, res, next) => {
  const chatName = req.body.name;
  const users = JSON.parse(req.body.users);

  if (!chatName || !users) {
    return next(new AppError("All fields are required!", 401));
  }

  if (users.length < 2) {
    return next(
      new AppError("Atleast 2 users are required to create a group", 401)
    );
  }

  users.push(req.user);

  const groupChat = await Chat.create({
    chatName: chatName,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user,
  });

  const fullChatData = await Chat.findOne({ id: groupChat._id })
    .populate("users", "-passowrd")
    .populate("groupAdmin", "-password");

  if (!fullChatData) {
    return next(
      new AppError(
        "There was an error while creating group chat. Please try again later",
        404
      )
    );
  }

  res.status(201).json({
    status: "created",
    data: {
      fullChatData,
    },
  });
});
