// import Session from "../models/Session.js";
// import User from "../models/User.js";

// export const setupSocketHandlers = (io) => {
//   io.on("connection", (socket) => {
//     console.log(`New client connected: ${socket.id}`); 

//     socket.on("send_message" , (data)=>{
//       console.log(data)
//     })

//   });
// };



//     // User joins with their ID
//     socket.on("join", async (userId) => {
//       try {
//         if (!userId) return socket.emit("error", { message: "Missing userId" });

//         activeUsers.set(userId, socket.id);
//         socket.userId = userId;

//         await User.findByIdAndUpdate(userId, { isOnline: true });

//         console.log(`User ${userId} connected with socket ${socket.id}`);
//         io.emit("user-status-update", { userId, status: "online" });
//       } catch (error) {
//         console.error("Join error:", error);
//       }
//     });

//     // User joins a session room
//     socket.on("join-session", async (sessionId) => {
//       try {
//         if (!socket.userId) return socket.emit("error", { message: "Unauthorized" });

//         const session = await Session.findById(sessionId).populate("Student Mentor");
//         if (!session) return socket.emit("error", { message: "Session not found" });

//         const userId = socket.userId;
//         if (session.Student._id.toString() !== userId && session.Mentor._id.toString() !== userId) {
//           return socket.emit("error", { message: "Unauthorized access to session" });
//         }

//         socket.join(sessionId);
//         activeSessions.set(sessionId, {
//           ...(activeSessions.get(sessionId) || {}),
//           [userId]: socket.id,
//         });

//         console.log(`User ${userId} joined session ${sessionId}`);
//       } catch (error) {
//         console.error("Join session error:", error);
//         socket.emit("error", { message: "Failed to join session" });
//       }
//     });

//     // Handle chat messages
//     socket.on("send-message", async (data) => {
//       try {
//         const { sessionId, message, messageType = "text" } = data;
//         const userId = socket.userId;
//         if (!userId) return socket.emit("error", { message: "Unauthorized" });

//         const session = await Session.findById(sessionId);
//         if (!session) return socket.emit("error", { message: "Session not found" });

//         const newMessage = {
//           sender: userId,
//           message,
//           messageType,
//           timestamp: new Date(),
//         };

//         session.messages.push(newMessage);
//         await session.save();

//         await session.populate("messages.sender", "name profilePicture");
//         const populatedMessage = session.messages[session.messages.length - 1];

//         io.to(sessionId).emit("new-message", populatedMessage);
//       } catch (error) {
//         console.error("Send message error:", error, data);
//         socket.emit("error", { message: "Failed to send message" });
//       }
//     });

//     // Typing indicator
//     socket.on("typing", (data) => {
//       try {
//         const { sessionId, isTyping } = data;
//         const userId = socket.userId;
//         if (!sessionId || !userId) return;

//         socket.to(sessionId).emit("user-typing", { userId, sessionId, isTyping });
//       } catch (error) {
//         console.error("Typing event error:", error);
//       }
//     });

//     // Video call signaling
//     socket.on("video-offer", (data) => {
//       const { sessionId, offer, to } = data;
//       const targetSocketId = activeUsers.get(to);

//       if (targetSocketId) {
//         io.to(targetSocketId).emit("video-offer", {
//           sessionId,
//           offer,
//           from: socket.userId,
//         });
//       }
//     });

//     socket.on("video-answer", (data) => {
//       const { sessionId, answer, to } = data;
//       const targetSocketId = activeUsers.get(to);

//       if (targetSocketId) {
//         io.to(targetSocketId).emit("video-answer", {
//           sessionId,
//           answer,
//           from: socket.userId,
//         });
//       }
//     });

//     socket.on("ice-candidate", (data) => {
//       const { sessionId, candidate, to } = data;
//       const targetSocketId = activeUsers.get(to);

//       if (targetSocketId) {
//         io.to(targetSocketId).emit("ice-candidate", {
//           sessionId,
//           candidate,
//           from: socket.userId,
//         });
//       }
//     });

//     // Update session status
//     socket.on("update-session-status", async (data) => {
//       try {
//         const { sessionId, status } = data;
//         const userId = socket.userId;
//         if (!userId) return socket.emit("error", { message: "Unauthorized" });

//         const session = await Session.findById(sessionId);
//         if (!session) return socket.emit("error", { message: "Session not found" });

//         if (["accepted", "rejected"].includes(status)) {
//           if (session.Mentor.toString() !== userId) {
//             return socket.emit("error", { message: "Only mentor can accept/reject" });
//           }
//         }

//         session.status = status;
//         if (status === "ongoing") {
//           session.startTime = new Date();
//         } else if (status === "completed") {
//           session.endTime = new Date();
//           session.duration = Math.round((session.endTime - session.startTime) / (1000 * 60));
//         }

//         await session.save();

//         io.to(sessionId).emit("session-status-updated", {
//           sessionId,
//           status,
//           startTime: session.startTime,
//           endTime: session.endTime,
//           duration: session.duration,
//         });
//       } catch (error) {
//         console.error("Update session status error:", error);
//         socket.emit("error", { message: "Failed to update session status" });
//       }
//     });

//     // Proper cleanup on disconnect
//     socket.on("disconnect", async () => {
//       try {
//         const userId = socket.userId;
//         if (userId) {
//           activeUsers.delete(userId);

//           for (const [sessionId, usersMap] of activeSessions.entries()) {
//             if (usersMap[userId]) {
//               delete usersMap[userId];
//               if (Object.keys(usersMap).length === 0) {
//                 activeSessions.delete(sessionId);
//               } else {
//                 activeSessions.set(sessionId, usersMap);
//               }
//             }
//           }

//           await User.findByIdAndUpdate(userId, { isOnline: false });
//           io.emit("user-status-update", { userId, status: "offline" });

//           console.log(`User ${userId} disconnected (Socket: ${socket.id})`);
//         }
//       } catch (error) {
//         console.error("Disconnect error:", error);
//       }
//     });
