const express = require("express")
const { createPromptController, getAllPromptController } = require("../controllers/prompt.controller")
const authMiddleware = require("../middleware/auth.middleware")


const router = express.Router()

router.post("/create",
    authMiddleware,
    createPromptController)


router.get("/allPrompts",
    authMiddleware,
    getAllPromptController)

module.exports = router