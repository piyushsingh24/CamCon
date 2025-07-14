import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import connectDB from "./config/database.js"
import authRoutes from "./routes/auth.js"
import collegeRoutes from "./routes/colleges.js"
// import userRoutes from "./routes/users.js"
// import sessionRoutes from "./routes/sessions.js"
// import paymentRoutes from "./routes/payments.js"

import { authenticateToken } from "./middleware/auth.js"
import { setupSocketHandlers } from "./socket/socketHandlers.js"

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/colleges", collegeRoutes)

// still have to work on it
// app.use("/api/users", authenticateToken, userRoutes)
// app.use("/api/sessions", authenticateToken, sessionRoutes)
// app.use("/api/payments", authenticateToken, paymentRoutes)

// Socket.IO setup
setupSocketHandlers(io)

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({ message: "Something went wrong!" })
// })

app.get('/' , (req, res)=>{
  res.send("hello world")
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 CampusConnect server running on port ${PORT}`)
})
