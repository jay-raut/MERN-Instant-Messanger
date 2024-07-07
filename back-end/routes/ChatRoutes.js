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
    if (!receiver || !chatName || !receiver._id) {
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
        await existingChat.populate({
          path: "users",
          match: { _id: { $ne: info.userID } },
          select: "-password",
        });
        return res.status(200).json({ chat: existingChat });
      }
      const newChat = await Chat.create(chatData);
      await newChat.populate({
        path: "users",
        match: { _id: { $ne: info.userID } },
        select: "-password",
      });

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
    if (!receiver || !receiver.users) {
      return res.status(400).json({ message: "no receiver specified" });
    }
    if (!chatName) {
      return res.status(400).json({ message: "No chat name specified" });
    }
    if (!receiver.users.includes(info.userID)) {
      receiver.users.push(info.userID);
    }
    if (receiver.users.length <= 2) {
      return res.status(400).send("More than 2 users are required for group chat");
    }

    const chatData = {
      chatname: chatName,
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
        await existingChat.populate({
          path: "users",
          match: { _id: { $ne: info.userID } },
          select: "-password",
        });

        return res.status(200).json({ chat: existingChat });
      }

      const newChat = await Chat.create(chatData);

      await newChat.populate({
        path: "users",
        match: { _id: { $ne: info.userID } },
        select: "-password",
      });

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
        .populate({
          path: "users",
          match: { _id: { $ne: info.userID } },
          select: "-password",
        })
        .populate("chatname")
        .sort({ updatedAt: -1 });
      res.status(200).json({ chats: userChats });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  });
});

router.post("/rename", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    const { groupChatID, newName } = req.body;
    if (!groupChatID || !newName) {
      return res.status(400).json({ message: "missing group chat ID or new name" });
    }
    try {
      const chat = await Chat.findById(groupChatID);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      if (!chat.users.some((u) => u._id.toString() === info.userID)) {
        return res.status(403).json({ message: "Not authorized to rename this chat" });
      }
      chat.chatname = newName;
      await chat.save();

      return res.status(200).json({ message: "Chat renamed successfully", chat });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  });
});

router.post("/adduser", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    const { groupChatID, newUserID } = req.body;
    if (!groupChatID || !newUserID) {
      return res.status(400).json({ message: "missing group chat id or new user id" });
    }
    try {
      const chat = await Chat.findById(groupChatID);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      if (!chat.users.some((u) => u._id.toString() === info.userID)) {
        return res.status(403).json({ message: "Not authorized to add users to this chat" });
      }
      if (chat.users.some((u) => u._id.toString === (info.userID))) {
        return res.status(400).json({ message: "User is already in this chat" });
      }
      chat.users.push(newUserID);
      if (chat.users.length > 2) {
        chat.isGroupChat = true;
      }
      await chat.save();
      return res.status(200).json({ message: "User added successfully", chat });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  });
});

router.post("/leave", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    const { groupChatID } = req.body;
    if (!groupChatID) {
      return res.status(400).json({ message: "missing group chat id" });
    }
    try {
      const chat = await Chat.findById(groupChatID);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      if (!chat.users.some((u) => u._id.toString() === info.userID)) {
        return res.status(403).json({ message: "User is not in this chat" });
      }
     
      chat.users = chat.users.filter((u) => u._id.toString() !== info.userID);
      if (chat.users.length == 2){
        chat.isGroupChat = false;
      }
      
      await chat.save();
      return res.status(200).json({ message: "User left group successfully", chat });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  });
});

module.exports = router;
