const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")



async function authRegisterController(req, res) {
    const { name, email, password } = req.body
    
    const isEmailExist = await userModel.findOne({ email })
    
    if (isEmailExist) {
        return res.status(400).json({
            message: "Email already exist",
        })
    }

    const user = await userModel.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token)


    res.status(200).json({
        message: "user created successfully",
        user
    })

}

async function authLoginController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message:"email already exits"
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "password is incorrect"
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token)
    
    res.status(200).json({
        message: "login successfully",
        user: {
            email: user.email,
            id: user._id

        }

    })

}


module.exports = {
    authRegisterController,
    authLoginController
}