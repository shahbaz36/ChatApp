const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const chatController = require("../controllers/chatController");
const { route } = require("./userRoutes");

const router = express.Router();

router.route("/").get(authController.protect, chatController.getUserChats);

module.exports = router;
