const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").post();

module.exports = router;
