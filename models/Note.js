// backend/models/Note.js
const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  heading: String,
  content: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Note", NoteSchema);
