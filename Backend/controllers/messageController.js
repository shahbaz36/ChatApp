const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return next(
      new AppError("Invalid data please provide both content and chatId", 400)
    );
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    //   message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("sender", { name: 1, pic: 1 });
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.status(201).json({
      status: "success",
      data: message,
    });
  } catch (error) {
    return next(new AppError("Problem while sending message", 400));
  }
});

exports.getAllMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name pic email")
    .populate("chat");

  res.status(200).json({
    status: "Success",
    data: messages,
  });
});
