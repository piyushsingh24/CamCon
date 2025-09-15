import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import collegeRoutes from "./routes/colleges.js";
// import userRoutes from "./routes/users.js"
import sessionRoutes from "./routes/sessions.js";
import cookieParser from "cookie-parser";
import mentorRoutes from "./routes/mentor.js";
import messageRoute from './routes/message.js';

dotenv.config();

const app = express();
const server = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://camcon-frontend.onrender.com"
];

// Setup CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);  // Allow Postman, etc.
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Setup Socket.IO with same CORS config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// JSON + URL encoding + Cookie Parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/messages", messageRoute);
app.use("/api/mentors", mentorRoutes);

// Socket.IO connection logic
const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('setup', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.emit('setup_complete', 'OK');
  });

  socket.on('send_message', (data) => {
    const receiverSocketId = onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', data);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    });
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("CamCon Backend is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 CamCon server running on port ${PORT}`);
});
