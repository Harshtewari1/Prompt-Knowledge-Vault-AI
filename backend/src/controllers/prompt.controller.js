
const Prompt = require("../models/promptVault.model");


const createPromptController = async (req, res) => {
    try {
        const { title, description, promptText, category, tags } = req.body;


        if (!title || !description || !promptText || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, description, promptText, and category.",
            });
        }


        const newPrompt = await Prompt.create({
            title,
            description,
            promptText,
            category,
            tags: tags || [],
            userId: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Prompt created successfully",
            data: newPrompt,
        });
    } catch (error) {
        console.error("Error creating prompt:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

const getAllPromptController = async (req, res) => {
    try {
        const { category, tags, search } = req.query;
        let filter = {}

        if (category) {
            filter.category = category;
        }

        if (tags) {
            const tagsArray = tags.split(",").map(tag => tag.trim())
            filter.tags = { $in: tagsArray };


        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { promptText: { $regex: search, $options: "i" } }
            ]
        }

        const prompts = await Prompt.find(filter).sort({ createAt: -1 })

        res.status(200).json({
            success: true,
            count: prompts.length,
            data: prompts
        })
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: "server error cant find prompt",
            error: error.message
        })

    }

}

const upadtePromptController = async (req, res) => {
    try {
        const { promptId } = req.params;
        console.log(promptId);
        
        const { title, description, promptText, tags, category } = req.body;

        const prompt = await Prompt.findById(promptId);
        console.log(prompt);
        
        if (!prompt) {
            return res.status(401).json({
                message: "Prompt Not Found"
            })
        }

        if (prompt.userId.toString() !== req.user.id) {
            return res.status(401).json({
                message: "You are not authorized to update this prompt"
            })
        }

        const updatedData = {}
        if (req.body.title !== undefined) {
            updatedData.title = title;
        }
        if (req.body.description !== undefined) {
            updatedData.description = description;
        }
        if (req.body.promptText !== undefined) {
            updatedData.promptText = promptText;
        }
        if (req.body.tags !== undefined) {
            updatedData.tags = tags;
        }
        if (req.body.category !== undefined) {
            updatedData.category = category;
        }

        const updatedPrompt = await Prompt.findByIdAndUpdate(
            promptId,
            { $set: updatedData },
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: "Prompt Updated Successfully",
            data: updatedPrompt
        })


    } catch (err) {
        console.log("updated Prompt error", err);
        res.status(400).json({
            success: false,
            message: "updated prompt server error",
            error: err.message
        })

    }
}

module.exports = { createPromptController, getAllPromptController, upadtePromptController };
