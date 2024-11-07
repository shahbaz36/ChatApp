const express = require("express");
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

const router = express.Router();

router.use(authController.protect);

router.route("/").post(messageController.sendMessage);
router.route("/:chatId").get(messageController.getAllMessages);

module.exports = router;
