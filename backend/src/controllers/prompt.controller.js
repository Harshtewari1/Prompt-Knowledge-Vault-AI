
const Prompt = require("../models/promptVault.model");
const genrateTags = require("../services/ai.sevice");


const createPromptController = async (req, res) => {
    try {
        const { title, description, promptText, category, tags } = req.body;


        if (!title || !description || !promptText || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, description, promptText, and category.",
            });
        }

        const aiTags = await genrateTags(title, description, promptText, category)
        const aiGeneratedTags = aiTags.split(",").map(tag=>tag.trim())
        console.log("ai generated tags : ", aiGeneratedTags);
        

        const newPrompt = await Prompt.create({
            title,
            description,
            promptText,
            category,
            tags: tags || [],
            aiGeneratedTags: aiGeneratedTags,
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

const searchAllPromptController = async (req, res) => {
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

const allPromptController = async (req, res) => {
    try {
        const posts = await Prompt.find().sort({ createdAt: -1 })
        
        res.status(200).json({
            success: true,
            message: "all prompts",
            count: posts.length,
            data: posts,

        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message:"prompts cant fetch"
        })
    }
}

const myPromptsController = async (req, res) => {
   try {
       if (!req.user.id) {
           return res.status(400).json({
               mmessage: "User ID not found in request"
           })
       }
       const posts = await Prompt.find({ userId: req.user.id }).sort({ createdAt: -1 })

       res.status(200).json({
           success: true,
           message: "my prompts",
           count: posts.length,
           data: posts,
       })
   } catch (error) {
       res.status(400).json({
           success: false,
           message: "prompts cant fetch"
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

const deletePromptController = async (req, res) => {
   try {
       const { promptId } = req.params;
       const userId = req.user.id;

       const prompt = await Prompt.findById(promptId)

       if (!prompt) {
           return res.status(400).json({
               success: false,
               message: "Prompt not found"
           })
       }

       if (prompt.userId.toString() !== userId) {
           return res.status(401).json({
               success: false,
               message: "You are not authorized to delete this prompt"
           })
       }

       await Prompt.findByIdAndDelete(promptId);

       return res.status(200).json({
           success: true,
           message:"deleted the prompt"
       })
   } catch (error) {
       res.status(400).json({
           success: false,
           message:"error on delete this prompt",
        })
   }

}

module.exports = { createPromptController, allPromptController, myPromptsController, searchAllPromptController, upadtePromptController, deletePromptController };
