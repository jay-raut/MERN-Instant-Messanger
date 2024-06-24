require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieparser = require("cookie-parser");
const bcrypt = require("bcryptjs");


const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://cluster0.lnwvlqw.mongodb.net/Instant-Messanger?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=Cluster0", {
  tlsCertificateKeyFile: process.env.mongo_cert,
});
const User = require("./mongo_models/users");
const Message = require("./mongo_models/message");
const Chat = require("./mongo_models/chat");

app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.post("/register", async (req, res) => {
  const { firstname, lastname, username, password } = req.body;

  try {
    if (!firstname || !lastname || !username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      first_name: firstname,
      last_name: lastname,
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: "User registered successfully.", user: savedUser });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
});

app.post("/login", (req, res) => {});

app.listen(4000, console.log("Server started on port 4000"));
