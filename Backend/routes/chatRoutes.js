const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const chatController = require("../controllers/chatController");
const { route } = require("./userRoutes");

const router = express.Router();

//To protect all the chat routes
router.use(authController.protect);

router
  .route("/")
  .get(chatController.getUserChats)
  .post(chatController.accessChat);

router.route("/groupChat").post(chatController.createGroupChat);
router.route("/rename").put(chatController.renameGroup);
router.route("/groupAdd").put(chatController.addToGroup);
router.route("/groupRemove").put(chatController.removeFromGroup);

module.exports = router;
