const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minLength: [1, "Lesson title cannot be empty"]
        },
        content: {
            type: [mongoose.Schema.Types.Mixed],
            required: true
        },
        isEnriched: {
            type: Boolean,
            default: false
        },
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);