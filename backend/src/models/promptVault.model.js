const mongoose = require("mongoose")


const promptSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true, // user specific prompts
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters long"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: [10, "Description must be at least 10 characters long"],
        },
        promptText: {
            type: String,
            required: [true, "Prompt text is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            enum: ["Writing", "Code", "Design", "Research", "Other"], // pre-defined categories
        },
        tags: {
            type: [String],
            default: [],
        },
        aiGeneratedTags: {
            type: [String],
            default: [], // Auto-generated from Gemini API
        },
        exportFormats: {
            type: [String],
            enum: ["JSON", "PDF"],
            default: [],
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

const promptModel = mongoose.model("promt", promptSchema)


module.exports = promptModel