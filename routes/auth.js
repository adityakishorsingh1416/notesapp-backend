// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Redirect root → login
router.get("/", (req, res) => {
  res.redirect("/login");
});

// Render pages
router.get("/login", (req, res) => {
  res.render("login", { message: null });
});

router.get("/register", (req, res) => {
  res.render("register", { message: null });
});

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render("register", { message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  req.session.user = newUser;

  // FIXED spelling
  res.render("success", { username: newUser.username });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.render("login", { message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render("login", { message: "Incorrect password" });

  req.session.user = user;

  res.render("success", { username: user.username });
});


// SUCCESS PAGE
router.get("/success", (req, res) => {
  res.render("success", { username: req.session.user?.username });
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// LOGIN CHECK for React
router.get("/check", (req, res) => {
  if (req.session.user) {
    return res.json({
      loggedIn: true,
      username: req.session.user.username,
    });
  }
  res.json({ loggedIn: false });
});

module.exports = router;
