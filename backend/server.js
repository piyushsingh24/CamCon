import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import connectDB from "./config/database.js"
import authRoutes from "./routes/auth.js"
import collegeRoutes from "./routes/colleges.js"
import userRoutes from "./routes/users.js"
import sessionRoutes from "./routes/sessions.js"
import paymentRoutes from "./routes/payments.js"
import cookieParser from "cookie-parser"

import { authenticateToken } from "./middleware/auth.js"
import { setupSocketHandlers } from "./socket/socketHandlers.js"

dotenv.config()

const app = express();
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/colleges", collegeRoutes)
app.use("/api/users", userRoutes)
app.use("/api/sessions", sessionRoutes)
app.use("/api/payments", paymentRoutes)

// Socket.IO setup
setupSocketHandlers(io)

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({ message: "Something went wrong!" })
// })

app.get('/', (req, res) => {
  res.send("hello world")
})

const PORT = process.env.PORT || 5001

server.listen(PORT, () => {
  console.log(`🚀CamCon server running on port ${PORT}`)
})
