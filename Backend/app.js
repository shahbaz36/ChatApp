const express = require("express");
const path = require('path');
const fs = require('fs');
const dotenv = require("dotenv");
const cors = require("cors");


const GEH = require("./controllers/errorController");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const AppError = require("./utils/AppError");

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
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);

// ==============DEPLOYMENT==============

const __dirname1 = path.resolve();
dotenv.config({ path: './config.env' })

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get('*', (req, res, next) => {
    const filePath = path.resolve(__dirname1, "frontend", "dist", "index.html");
    console.log(filePath)
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });
} else {
  app.get('/', (req, res) => {
    res.send("API setup successful");
  });
}

// ==============DEPLOYMENT==============

// Unhandled Routes
app.all("*", (req, res, next) => {
  next(new AppError("This API doesn't exist on this server", 404));
});

// Global Error Handling Middleware
app.use(GEH);

module.exports = app;
