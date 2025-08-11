const mongoose = require("mongoose")


function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log("connect to db"))
        .catch(err => console.log("mongodb connection error", err))
}


module.exports = connectDB