require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieparser = require("cookie-parser");
const UserRoutes = require("./routes/UserRoutes");
const ChatRoutes = require("./routes/ChatRoutes");
const MessageRoutes = require("./routes/MessageRoutes");



const mongoose = require("mongoose");
mongoose.connect(process.env.mongo_db, {
  tlsCertificateKeyFile: process.env.mongo_cert,
});

app.use(express.json());
app.use(cookieparser());
app.use(
  cors({credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use('/api/user', UserRoutes);
app.use('/api/chat', ChatRoutes);
app.use('/api/message', MessageRoutes);


const api_server = app.listen(4000, console.log("Server started on port 4000"));
const io = require('socket.io')(api_server, {
  cors: {
    origin: "http://localhost:3000"
  },
  pingTimeout: 60000
})
io.on('connection', (socket) => {


  socket.on("setup", (userData) => {
    socket.join(userData.userID);
    console.log(`user ${userData.userID} connected`);
    socket.emit('connected');
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
    console.log('joined room ' + room._id);
  })

  socket.on("send-message", (message) => {
    const chat = message.groupChat;
    if (!chat.users){
      return console.log('chat users undefined');
    }
    chat.users.forEach((user => {
      socket.in(user._id).emit("message-received", message);
    }))
  });
})

