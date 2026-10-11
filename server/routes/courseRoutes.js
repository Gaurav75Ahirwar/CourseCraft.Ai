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

// Update a course
router.patch("/:id", async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { title, description, tags },
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course updated successfully", course });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        res.status(400).json({ message: "Failed to update course", error: err.message });
    }
});

// Delete a course
router.delete("/:id", async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(400).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully", courseId: course._id });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        res.status(500).json({ message: "Failed to delete course", error: err.message });
    }
});

module.exports = router;