const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../mongo_models/users");
const Message = require("../mongo_models/message");
const Chat = require("../mongo_models/chat");
const generateToken = require("../generate_jwt");
const jwt = require("jsonwebtoken");
const secret = process.env.secret_token_key;
router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(403).json({ message: "Username or password incorrect" });
    }

    const password_result = await bcrypt.compare(password, userDoc.password);
    if (!password_result) {
      return res.status(403).json({ message: "Username or password incorrect" });
    }

    const token = generateToken({
      firstname: userDoc.first_name,
      lastname: userDoc.last_name,
      username: userDoc.username,
      userID: userDoc._id,
    });

    res.cookie("token", token).json({
      first_name: userDoc.first_name,
      last_name: userDoc.last_name,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
});

router.get("/find-user", async (req, res) => {
  try {
    const searchQuery = req.query.search;

    let query = {};
    if (searchQuery) {
      query = {
        $or: [{ first_name: { $regex: searchQuery, $options: "i" } }, { last_name: { $regex: searchQuery, $options: "i" } }, { username: { $regex: searchQuery, $options: "i" } }],
      };
    }

    const users = await User.find(query).select("-password").select("-createdAt").select("-updatedAt").select("-__v");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error finding users:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

router.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.status(200).json(info);
  });
});

module.exports = router;
