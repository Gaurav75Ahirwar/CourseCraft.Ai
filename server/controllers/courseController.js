const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");

// Create a Course
const createCourse = async (req, res) => {
    try {
        const { title, description, creator, tags } = req.body;

        const course = await Course.create({ title, description, creator, tags });

        res.status(201).json({
            message: "Course created successfully",
            course
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid course data",
                errors: Object.values(err.errors).map(
                    (error) => error.message
                )
            });
        }

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Get all Courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .select("title description tags createdAt")
            .sort({ createdAt: -1 });

        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch courses"
        });
    }
};

// Get one Course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("modules", "title");

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json(course);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Update a Course
const updateCourse = async (req, res) => {
    try {
        const updates = {};

        for (const field of ["title", "description", "tags"]) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No fields provided for update"
            });
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json({
            message: "Course updated successfully",
            course
        });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid course data",
                errors: Object.values(err.errors).map(
                    (error) => error.message
                )
            });
        }

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Delete a Course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const modules = await Module.find({
            course: course._id
        }).select("_id");

        const moduleIds = modules.map((module) => module._id);

        await Lesson.deleteMany({
            module: { $in: moduleIds }
        });

        await Module.deleteMany({
            course: course._id
        });

        await Course.findByIdAndDelete(course._id);

        res.status(200).json({
            message: "Course deleted successfully",
            courseId: course._id
        });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        res.status(500).json({
            message: "Failed to delete course"
        });
    }
};

module.exports = { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };