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
    const { receiver } = req.body;
    if (!receiver) {
      return res.status(400).json({ message: "no receiver specified" });
    }
    const chatData = {
      chatName: "Default",
      isGroupChat: false,
      users: [info.userID, receiver._id],
    };

    try {
      const existingChat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [info.userID, receiver._id] },
      });

      if (existingChat) {
        return res.status(200).json({ chat_exist: existingChat });
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
        .sort({ updatedAt: -1 });
      res.status(200).json({ chats: userChats });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  });
});

module.exports = router;
