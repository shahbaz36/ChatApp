const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const Router = express.Router();

Router.route("/")
  .post(authController.signUp)
  .get(authController.protect, userController.getAllUsers);

Router.route("/signin").post(authController.signIn);

Router.route("/forgotPassword").post(authController.forgotPassword);
Router.route("/resetPassword/:originalToken").patch(
  authController.resetPassword
);

Router.route("/updateMyPassword").patch(
  authController.protect,
  authController.updatePassword
);

Router.route("/updateMe").patch(
  authController.protect,
  userController.updateMe
);

Router.route("/deleteMe").delete(
  authController.protect,
  userController.deleteMe
);

module.exports = Router;
