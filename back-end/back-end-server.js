require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://cluster0.lnwvlqw.mongodb.net/Instant-Messanger?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=Cluster0", {
  tlsCertificateKeyFile: process.env.mongo_cert,
});
const User = require("./mongo_models/users");
const Message = require("./mongo_models/message");
const Chat = require("./mongo_models/chat");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.post("/register", (req, res) => {});

app.post("/login", (req, res) => {});

app.listen(4000, console.log("Server started on port 4000"));
