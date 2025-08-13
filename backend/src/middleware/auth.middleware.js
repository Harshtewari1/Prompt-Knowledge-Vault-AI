const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model")


async function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message:"unauthorised access ,  please login first"
        })
    }

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne(
            {_id : decoded.id}
        )
        console.log(decoded);
        console.log(user);
        
        
        req.user = user;
        req.user.id = user._id;
        next()
    } catch (err) {
        return res.status(401).json({
            message:"invalid token , please login first"
        })
    }
}




module.exports = authMiddleware