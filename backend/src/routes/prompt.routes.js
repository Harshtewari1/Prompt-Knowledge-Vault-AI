const express = require("express")
const { createPromptController, getAllPromptController, upadtePromptController } = require("../controllers/prompt.controller")
const authMiddleware = require("../middleware/auth.middleware")


const router = express.Router()

router.post("/create",
    authMiddleware,
    createPromptController)


router.get("/allPrompts",
    authMiddleware,
    getAllPromptController)


router.patch("/:promptId",
    authMiddleware,
    upadtePromptController
)

module.exports = router