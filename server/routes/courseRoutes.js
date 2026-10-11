const express = require("express");
const router = express.Router();

const Course = require("../models/Course");

// Fetch course by id
router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(400).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid course id" });
        }

        res.status(500).json({ message: "Failed to fetch course", error: err.message });
    }
});

// Fetch courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });

        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch courses", error: err.message });
    }
});

// Create a new Course
router.post("/", async (req, res) => {
    try {
        const { title, description, creator, tags } = req.body;

        const course = await Course.create({ title, description, creator, tags });

        res.status(201).json({ message: "Course created successfully", course });
    } catch (err) {
        res.status(400).json({ message: "Failed to create course", error: err.message });
    }
});

module.exports = router;