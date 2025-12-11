const express = require("express");
const Note = require("../models/Note");
const router = express.Router();

// Middleware to require login
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
}

// GET NOTES → only user's notes
router.get("/", requireLogin, async (req, res) => {
  const notes = await Note.find({ userId: req.session.user._id });
  res.json(notes);
});

// CREATE NOTE → attach userId
router.post("/", requireLogin, async (req, res) => {
  const { heading, content } = req.body;

  const newNote = new Note({
    heading,
    content,
    userId: req.session.user._id
  });

  await newNote.save();
  res.json({ newNote });
});

// UPDATE NOTE → only if note belongs to user
router.put("/:id", requireLogin, async (req, res) => {
  const { id } = req.params;

  const updatedNote = await Note.findOneAndUpdate(
    { _id: id, userId: req.session.user._id },
    req.body,
    { new: true }
  );

  res.json({ updatedNote });
});

// DELETE NOTE → only if note belongs to user
router.delete("/:id", requireLogin, async (req, res) => {
  const { id } = req.params;

  await Note.findOneAndDelete({ _id: id, userId: req.session.user._id });

  res.json({ success: true });
});

module.exports = router;
