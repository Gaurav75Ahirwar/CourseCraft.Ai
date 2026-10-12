const express = require("express");
const router = express.Router();

const { createModule, getAllModules, getModuleById, updateModule, deleteModule } = require("../controllers/moduleController");

const Module = require("../models/Module");

// Create a module
router.post("/", createModule);

// Get all modules
router.get("/", getAllModules);

// Get one module by ID
router.get("/:id", getModuleById);

// Update a module
router.patch("/:id", updateModule);

// Delete a module
router.delete("/:id", deleteModule);

module.exports = router;