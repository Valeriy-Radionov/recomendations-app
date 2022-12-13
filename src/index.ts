import express from "express"
import cors from "cors"
import { connectMongoDb } from "./database/connect"
import cookieParser from "cookie-parser"
import { authRouter } from "./routes/authRouter"
import { errorMiddleware } from "./middlewares/error-middleware"
require("dotenv").config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.get("/", (req, res) => {
  res.send("Hello world")
})
app.use("/api", authRouter)
app.use(errorMiddleware)
const start = async () => {
  try {
    await connectMongoDb()
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}
start()
