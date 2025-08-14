const express = require("express")
const { createPromptController, allPromptController, searchAllPromptController, upadtePromptController, deletePromptController, myPromptsController } = require("../controllers/prompt.controller")
const authMiddleware = require("../middleware/auth.middleware")


const router = express.Router()

router.post("/create",
    authMiddleware,
    createPromptController)


router.get("/searchPrompts",
    authMiddleware,
    searchAllPromptController)

router.get("/allPrompts",
    authMiddleware,
    allPromptController
)

router.get("/myPrompts",
    authMiddleware,
    myPromptsController
)

router.patch("/:promptId",
    authMiddleware,
    upadtePromptController
)

router.delete("/:promptId",
    authMiddleware,
    deletePromptController
)



module.exports = router