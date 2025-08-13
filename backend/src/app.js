const express = require("express")
const authRoutes = require("./routes/auth.routes")
const promptRoutes = require("./routes/prompt.routes")
const cookieParser = require('cookie-parser');

const app = express()




app.use(express.json());
app.use(cookieParser());


app.use("/auth", authRoutes)
app.use("/prompt" , promptRoutes)

module.exports = app