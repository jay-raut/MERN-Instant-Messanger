const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Chat = require("../mongo_models/chat");
const secret = process.env.secret_token_key;

router.post("/", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    const { receiver, chatName } = req.body;
    if (!receiver || !chatName) {
      return res.status(400).json({ message: "no receiver or chat name specified" });
    }
    const chatData = {
      chatname: chatName,
      isGroupChat: false,
      users: [info.userID, receiver._id],
      latestMessage: null,
    };

    try {
      const existingChat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [info.userID, receiver._id] },
      });

      if (existingChat) {
        return res.status(200).json({ chat: existingChat });
      }
      const newChat = await Chat.create(chatData);
      res.status(200).json({ chat: newChat });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  });
});

router.post("/group", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    const { receiver, chatName } = req.body;
    if (!receiver) {
      return res.status(400).json({ message: "no receiver specified" });
    }
    if (!receiver.users.includes(info.userID)) {
      receiver.users.push(info.userID);
    }
    if (receiver.users.length <= 2) {
      return res.status(400).send("More than 2 users are required for group chat");
    }

    const chatData = {
      chatName: chatName,
      isGroupChat: true,
      users: receiver.users,
      latestMessage: null,
    };

    try {
      const existingChat = await Chat.findOne({
        isGroupChat: true,
        users: { $all: receiver.users, $size: receiver.users.length },
      });

      if (existingChat) {
        return res.status(200).json({ chat: existingChat });
      }
      const newChat = await Chat.create(chatData);
      res.status(200).json({ chat: newChat });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  });
});

router.get("/", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    try {
      const userChats = await Chat.find({ users: { $elemMatch: { $eq: info.userID } } })
        .populate("users", "-password")
        .populate("chatname")
        .sort({ updatedAt: -1 });
      res.status(200).json({ chats: userChats });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  });
});

module.exports = router;
