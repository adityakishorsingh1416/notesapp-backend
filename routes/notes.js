const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// ---------------- GET ALL NOTES ----------------
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- ADD NOTE ----------------
router.post("/", async (req, res) => {
  try {
    const { heading, content } = req.body;

    const newNote = new Note({
      heading,
      content
    });

    await newNote.save();

    res.json({ message: "Note added", newNote });
  } catch (err) {
    res.status(500).json({ error: "Error adding note" });
  }
});

// ---------------- DELETE NOTE ----------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted", deletedNote });
  } catch (err) {
    res.status(500).json({ error: "Error deleting note" });
  }
});

// ---------------- UPDATE NOTE ----------------
router.put("/:id", async (req, res) => {
  try {
    const { heading, content } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { heading, content },
      { new: true }
    );

    res.json({ message: "Note updated", updatedNote });
  } catch (err) {
    res.status(500).json({ error: "Error updating note" });
  }
});

module.exports = router;
