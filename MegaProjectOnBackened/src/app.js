import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, // it is allwoing whole url which is not safe . replace it with the frontened url while production
    credentials: true  // ✅ CORRECT
}))


app.use(express.json({limit: "20kb"})) // Request ke body me aane wala JSON data kaise read karna hai aur kitna allow karna hai
app.use(express.urlencoded({extended: true, limit: "20kb"})) //HTML forms ya URL-encoded data ko kaise read karna hai aur kitna allow karna hai

app.use(express.static("public"))
app.use(cookieParser())

// routes 

import userRouter from './routes/user.routes.js'

// routes declaration

app.use("/api/v1/users" , userRouter)
export {app}