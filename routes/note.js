const express = require("express");
const { body, validationResult } = require("express-validator");

const Note = require("../models/Note");
const fetchUser = require("../middlewares/fetchUser");

const router = express.Router();

// Fetch all Notes from database : GET "/api/note/fetchallnotes" Login required
router.get("/fetchallnotes", fetchUser, async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server Error Occured!" });
  }
});

// Add a new Note in database : POST "/api/note/addnote" Login required

router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Title must be 3 charater long").isLength({ min: 3 }),
    body("description", "Description must be 5 charater long").isLength({
      min: 5,
    }),
  ],
  async (req, res, next) => {
    // IF errors then return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;
    const userId = req.user.id;
    try {
      const note = await Note.create({
        title: title,
        description: description,
        tag: tag,
        user: userId,
      });
      res.json(note);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: "Internal server Error Occured!" });
    }
  }
);

// Update Note : PUT "/api/note/updatenote" Login required

router.put("/updatenote/:noteId", fetchUser, async (req, res, next) => {
  const { title, description, tag } = req.body;
  const userId = req.user.id;

  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  try {
    let note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== userId) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.noteId,
      { $set: newNote },
      { new: true }
    ); // new:true means allow new fileds

    res.json(note);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server Error Occured!" });
  }
});

// Delete Note : DELETE "/api/note/deletenote" Login required

router.delete("/deletenote/:noteId", fetchUser, async (req, res, next) => {
  const userId = req.user.id;
  const noteId = req.params.noteId;

  try {
    let note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== userId) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndRemove(noteId);

    res.json({ success: "note successfully deleted", note });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server Error Occured!" });
  }
});

module.exports = router;
