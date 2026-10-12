const express = require("express");
const router = express.Router();

const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } = require("../controllers/courseControllers");

const Course = require("../models/Course");

// Create a course
router.post("/", createCourse);

// Get all courses
router.get("/", getAllCourses);

// Get one course by ID
router.get("/:id", getCourseById);

// Update a course
router.patch("/:id", updateCourse);

// Delete a course
router.delete("/:id", deleteCourse);

module.exports = router;