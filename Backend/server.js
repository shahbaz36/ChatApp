const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = require("./app");

//Connecting to DB
dotenv.config({ path: "./config.env" });
const db = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db).then(() => {
  console.log("Connection to db successful");
});

//Server
const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Listening to request on port ${port}`);
});

// Socket.io
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173'
  }
})

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    // console.log("User joined room : " + room);
  })

  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  })

  socket.on('typing', (room) => socket.in(room).emit('typing'))
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

})

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(1);
});
