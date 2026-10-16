const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

// Create a Lesson
const createLesson = async (req, res) => {
    try {
        const { title, content, module: moduleId } = req.body;

        if (!moduleId) {
            return res.status(400).json({
                message: "Module ID is required"
            });
        }

        const existingModule = await Module.findById(moduleId);

        if (!existingModule) {
            return res.status(404).json({
                message: "Module not found"
            });
        }

        const lesson = await Lesson.create({
            title,
            content,
            module: moduleId
        });

        await Module.findByIdAndUpdate(moduleId, {
            $addToSet: { lessons: lesson._id }
        });

        res.status(201).json({
            message: "Lesson created successfully",
            lesson
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid lesson data",
                errors: Object.values(err.errors).map(
                    (error) => error.message
                )
            });
        }

        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid module ID"
            });
        }

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Get all Lessons
const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find()
            .sort({ createdAt: -1 });

        res.status(200).json(lessons);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch lessons"
        });
    }
};

// Get one Lesson by ID
const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }

        res.status(200).json(lesson);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid lesson ID"
            });
        }

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Update a Lesson
const updateLesson = async (req, res) => {
    try {
        const updates = {};

        for (const field of ["title", "content"]) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No fields provided for update"
            });
        }

        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }

        res.status(200).json({
            message: "Lesson updated successfully",
            lesson
        });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid lesson ID"
            });
        }

        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid lesson data",
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

// Delete a Lesson
const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }

        await Module.findByIdAndUpdate(lesson.module, {
            $pull: { lessons: lesson._id }
        });

        await Lesson.findByIdAndDelete(lesson._id);

        res.status(200).json({
            message: "Lesson deleted successfully",
            lessonId: lesson._id
        });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid lesson ID"
            });
        }

        res.status(500).json({
            message: "Failed to delete lesson"
        });
    }
};

module.exports = { createLesson, getAllLessons, getLessonById, updateLesson, deleteLesson };