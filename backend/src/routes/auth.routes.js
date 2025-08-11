const express = require("express")
const { authRegisterController, authLoginController } = require("../controllers/auth.controller")


const router = express.Router()

router.post("/register", authRegisterController)

router.post("/login" , authLoginController)


module.exports = router