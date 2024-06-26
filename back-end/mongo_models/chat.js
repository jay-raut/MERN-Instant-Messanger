const mongoose = require("mongoose");

const chatModel = mongoose.Schema({
  chatname: { type: String, trim: true },
  isGroupChat: { type: Boolean, default: false },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  latestMessage: {type: mongoose.Schema.Types.ObjectId}
});

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;
