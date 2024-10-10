const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const Router = express.Router();

//TODO Add restriction to admin only for get request
Router.route("/")
  .post(authController.signUp)
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  );

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
