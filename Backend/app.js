const express = require("express");

const GEH = require("./controllers/errorController");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const AppError = require("./utils/AppError");
const cors = require("cors");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");

  process.exit(1);
});

const app = express();
app.use(cors());

//To parse incoming request
app.use(express.json());

//Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/chats", chatRoute);

//Unhandled Routes
app.all("*", (req, res, next) => {
  next(new AppError("This Api doesn't exist on this server", 404));
});

//Global Error Handling Middleware
app.use(GEH);

module.exports = app;
