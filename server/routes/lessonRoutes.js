const express = require("express");
const router = express.Router();

const { createLesson, getAllLessons, getLessonById, updateLesson, deleteLesson } = require("../controllers/lessonController");

const Lesson = require("../models/Lesson");

// Create a Lesson
router.post("/", createLesson);

// Get all Lessons
router.get("/", getAllLessons);

// Get one Lesson by ID
router.get("/:id", getLessonById);

// Update a Lesson
router.patch("/:id", updateLesson);

// Delete a Lesson
router.delete("/:id", deleteLesson);

module.exports = router;