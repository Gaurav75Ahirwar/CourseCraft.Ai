const Module = require("../models/Module");
const Course = require("../models/Course");

// Create a module
const createModule = async (req, res) => {
    try {
        const { title, course } = req.body;

        if (!course) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const existingCourse = await Course.findById(course);
        if (!existingCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        const module = await Module.create({ title, course });

        await Course.findByIdAndUpdate(course, { $addToSet: { modules: module._id } });

        res.status(201).json({ message: "Module created successfully", module });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid module data", errors: Object.values(err.errors).map((error) => error.message) });
        }

        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all modules
const getAllModules = async (req, res) => {
    try {
        const modules = await Module.find().sort({ createdAt: -1 });

        res.status(200).json(modules);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch modules" });
    }
};

// Get one module by ID
const getModuleById = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        res.status(200).json(module);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid module ID" });
        }

        res.status(500).json({ message: "Failed to fetch module" });
    }
};

// Update a module
const updateModule = async (req, res) => {
    try {
        const { title } = req.body;

        const module = await Module.findByIdAndUpdate(
            req.params.id,
            { title },
            { new: true, runValidators: true }
        );

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        res.status(200).json({ message: "Module updated successfully", module });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid module ID" });
        }

        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid module data", errors: Object.values(err.errors).map((error) => error.message) });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a module
const deleteModule = async (req, res) => {
    try {
        const module = await Module.findByIdAndDelete(req.params.id);

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        await Course.findByIdAndUpdate(module.course, { $pull: { modules: module._id } });

        res.status(200).json({ message: "Module deleted successfully", moduleId: module._id });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid module ID" });
        }

        res.status(500).json({ message: "Failed to delete module", error: err.message });
    }
};

module.exports = { createModule, getAllModules, getModuleById, updateModule, deleteModule };