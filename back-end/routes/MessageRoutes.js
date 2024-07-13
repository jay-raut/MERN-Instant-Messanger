const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Chat = require("../mongo_models/chat");
const MessageModel = require("../mongo_models/message");
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
    const { groupChatID, message } = req.body;
    if (!groupChatID) {
      return res.status(400).json({ message: "missing group chat id" });
    }
    if (!message) {
      return res.status(400).json({ message: "missing message content" });
    }
    try {
      const chat = await Chat.findById(groupChatID);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      if (!chat.users.some((u) => u._id.toString() === info.userID)) {
        return res.status(403).json({ message: "Not authorized to send messages to this chat" });
      }
      const chatMessage = {
        sender: info.userID,
        content: message,
        chat: groupChatID,
      };
      const newMessage = await MessageModel.create(chatMessage);

      // Update the latest message in the chat
      chat.latestMessage = newMessage._id;
      await chat.save();

      // Populate the sender field
      const populatedMessage = await MessageModel.findById(newMessage._id).populate({ path: "sender", select: "-password" });

      // Return the response with the populated message
      return res.status(200).json({ message: "message sent", newMessage: populatedMessage });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
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

    const chatID = req.query.chatID;
    if (!chatID) {
      return res.status(400).json({ message: "chatID is required" });
    }

    try {
      const chat = await Chat.findById(chatID);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      if (!chat.users.some((u) => u._id.toString() === info.userID)) {
        return res.status(403).json({ message: "Not authorized to view messages to this chat" });
      }
      const messages = await MessageModel.find({ chat: chatID }).populate({ path: "sender", select: "-password" });
      return res.status(200).json({ messages });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error retrieving messages" });
    }
  });
});

module.exports = router;
