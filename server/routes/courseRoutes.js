const express = require("express");
const router = express.Router();

const Course = require("../models/Course");

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