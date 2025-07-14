import Session from "../models/Session.js"
import User from "../models/User.js"

const activeUsers = new Map()
const activeSessions = new Map()

export const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    // User joins with their ID
    socket.on("join", async (userId) => {
      try {
        activeUsers.set(userId, socket.id)
        socket.userId = userId

        // Update user online status
        await User.findByIdAndUpdate(userId, { isOnline: true })

        console.log(`User ${userId} joined`)
      } catch (error) {
        console.error("Join error:", error)
      }
    })

    // Join session room
    socket.on("join-session", async (sessionId) => {
      try {
        const session = await Session.findById(sessionId).populate("junior senior")

        if (!session) {
          socket.emit("error", { message: "Session not found" })
          return
        }

        // Check if user is part of this session
        const userId = socket.userId
        if (session.junior._id.toString() !== userId && session.senior._id.toString() !== userId) {
          socket.emit("error", { message: "Unauthorized access to session" })
          return
        }

        socket.join(sessionId)
        activeSessions.set(sessionId, {
          ...activeSessions.get(sessionId),
          [userId]: socket.id,
        })

        console.log(`User ${userId} joined session ${sessionId}`)
      } catch (error) {
        console.error("Join session error:", error)
        socket.emit("error", { message: "Failed to join session" })
      }
    })

    // Handle chat messages
    socket.on("send-message", async (data) => {
      try {
        const { sessionId, message, messageType = "text" } = data
        const userId = socket.userId

        // Save message to database
        const session = await Session.findById(sessionId)
        if (!session) {
          socket.emit("error", { message: "Session not found" })
          return
        }

        const newMessage = {
          sender: userId,
          message,
          messageType,
          timestamp: new Date(),
        }

        session.messages.push(newMessage)
        await session.save()

        // Populate sender info for the response
        await session.populate("messages.sender", "name profilePicture")
        const populatedMessage = session.messages[session.messages.length - 1]

        // Emit to all users in the session
        io.to(sessionId).emit("new-message", populatedMessage)
      } catch (error) {
        console.error("Send message error:", error)
        socket.emit("error", { message: "Failed to send message" })
      }
    })

    // Handle video call signals
    socket.on("video-offer", (data) => {
      const { sessionId, offer, to } = data
      const targetSocketId = activeUsers.get(to)

      if (targetSocketId) {
        io.to(targetSocketId).emit("video-offer", {
          sessionId,
          offer,
          from: socket.userId,
        })
      }
    })

    socket.on("video-answer", (data) => {
      const { sessionId, answer, to } = data
      const targetSocketId = activeUsers.get(to)

      if (targetSocketId) {
        io.to(targetSocketId).emit("video-answer", {
          sessionId,
          answer,
          from: socket.userId,
        })
      }
    })

    socket.on("ice-candidate", (data) => {
      const { sessionId, candidate, to } = data
      const targetSocketId = activeUsers.get(to)

      if (targetSocketId) {
        io.to(targetSocketId).emit("ice-candidate", {
          sessionId,
          candidate,
          from: socket.userId,
        })
      }
    })

    // Handle session status updates
    socket.on("update-session-status", async (data) => {
      try {
        const { sessionId, status } = data
        const userId = socket.userId

        const session = await Session.findById(sessionId)
        if (!session) {
          socket.emit("error", { message: "Session not found" })
          return
        }

        // Only senior can accept/reject, both can end
        if (status === "accepted" || status === "rejected") {
          if (session.senior.toString() !== userId) {
            socket.emit("error", { message: "Only senior can accept/reject sessions" })
            return
          }
        }

        session.status = status
        if (status === "ongoing") {
          session.startTime = new Date()
        } else if (status === "completed") {
          session.endTime = new Date()
          session.duration = Math.round((session.endTime - session.startTime) / (1000 * 60))
        }

        await session.save()

        // Notify all users in the session
        io.to(sessionId).emit("session-status-updated", {
          sessionId,
          status,
          startTime: session.startTime,
          endTime: session.endTime,
          duration: session.duration,
        })
      } catch (error) {
        console.error("Update session status error:", error)
        socket.emit("error", { message: "Failed to update session status" })
      }
    })

    // Handle disconnect
    socket.on("disconnect", async () => {
      try {
        const userId = socket.userId
        if (userId) {
          activeUsers.delete(userId)

          // Update user offline status
          await User.findByIdAndUpdate(userId, { isOnline: false })

          console.log(`User ${userId} disconnected`)
        }
      } catch (error) {
        console.error("Disconnect error:", error)
      }
    })
  })
}
