const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, "Course title cannot be empty"]
        },
        description: {
            type: String,
            default: "",
            trim: true
        },
        creator: {
            type: String,
            required: true
        },
        modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
        tags: [{ type: String, trim: true }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);