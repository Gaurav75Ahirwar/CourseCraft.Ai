const Course = require("../models/Course");

// Create a course
const createCourse = async (req, res) => {
    try {
        const { title, description, creator, tags } = req.body;

        const course = await Course.create({ title, description, creator, tags });

        res.status(201).json({ message: "Course created successfully", course });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid course data", errors: Object.values(err.errors).map((error) => error.message) });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });

        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch courses", error: err.message });
    }
};

// Get one course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(400).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        res.status(500).json({ message: "Failed to fetch course", error: err.message });
    }
};

// Update a course
const updateCourse = async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { title, description, tags },
            { new: true, runValidators: true }
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
};

// Delete a course
const deleteCourse = async (req, res) => {
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
};

module.exports = { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };