require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieparser = require("cookie-parser");
const UserRoutes = require("./routes/UserRoutes");
const ChatRoutes = require("./routes/ChatRoutes");
const MessageRoutes = require("./routes/MessageRoutes");
const jwt = require("jsonwebtoken");
const secret = process.env.secret_token_key;

const mongoose = require("mongoose");
mongoose.connect(process.env.mongo_db, {
  tlsCertificateKeyFile: process.env.mongo_cert,
});

app.use(express.json());
app.use(cookieparser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use("/api/user", UserRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/api/message", MessageRoutes);

function verifyToken(token) {
  if (!token) {
    return false;
  }
  var return_verify_status = true;
  jwt.verify(token, secret, (err, decoded_token) => {
    if (err) {
      return_verify_status = false;
    }
  });
  return return_verify_status;
}

const api_server = app.listen(4000, console.log("Server started on port 4000"));
const io = require("socket.io")(api_server, {
  cors: {
    origin: "http://localhost:3000",
  },
  pingTimeout: 60000,
});

io.use((socket, next) => {
  //jwt auth
  const token = socket.handshake.query.token;
  if (verifyToken(token)) {
    next();
  } else {
    next(new Error("Could not verify token"));
  }
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData.userID);
    console.log(`user ${userData.userID} connected`);
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room._id);
    console.log("joined room " + room._id);
  });

  socket.on("send-message", (message) => {
    const chat = message.groupChat;
    if (!chat.users) {
      return console.log("chat users undefined");
    }
    message.groupChat.latestMessage = message.messageContent;
    chat.users.forEach((user) => {
      socket.in(user._id).emit("message-received", message);
    });
  });

  socket.on("leave-chat", (room, user) => {
    socket.leave(room._id);
    if (room.users.length <= 2) {
      room.isGroupChat = false;
    }
    room.users.forEach((send_user) => {
      if (send_user._id !== user._id) {
        socket.in(send_user._id).emit("user-left", user, room);
      }
    });
  });

  socket.on("add-user", (room, user) => {
    if (room.users.length > 2) {
      room.isGroupChat = true;
    }
    room.users.forEach((send_user) => {
      if (send_user._id !== user._id) {
        socket.in(send_user._id).emit("user-added", user, room);
      }
    });
  });

  socket.on("rename-chat", (room, newName) => {
    room.users.forEach((user) => {
      socket.in(user._id).emit("chat-renamed", newName, room);
    });
  });

  socket.on("profile-update", (updatedUser, notifyUsers) => {
    console.log(updatedUser);
    console.log(notifyUsers);
    notifyUsers.forEach((user) => {
      socket.in(user._id).emit("update-profile", updatedUser);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
