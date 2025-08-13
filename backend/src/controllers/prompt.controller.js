
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

module.exports = { createPromptController ,getAllPromptController };
