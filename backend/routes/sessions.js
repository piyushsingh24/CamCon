import express from "express";
import Session from "../models/Session.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

//get session details 
router.post("/me", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

  try {
    const session = await Session.findById(sessionId);

    if (!session) return res.status(404).json({ error: "Session not found" });

    return res.status(200).json({ session });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

//requested session
router.post('/request', async (req, res) => {
  try {
    const { studentId, mentorId, studentName, mentorName } = req.body;

    if (!studentId || !mentorId || !studentName || !mentorName) {
      return res.status(400).json({ error: "All fields (studentId, mentorId, studentName, mentorName) are required." });
    }

    // Prevent duplicate requests
    const existingSession = await Session.findOne({
      studentId,
      mentorId,
      status: 'requested'
    });

    if (existingSession) {
      return res.status(409).json({ error: "Session request already sent and pending." });
    }

    const session = new Session({
      studentId,
      mentorId,
      studentName,
      mentorName,
      status: "requested"
    });

    await session.save();

    res.status(201).json({ message: "Session request created successfully.", session });
  } catch (err) {
    console.error('Error in /sessions/request:', err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get sessions by student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const sessions = await Session.find({ studentId:studentId});

    return res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mentor accepts a request
router.post('/accept/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });

    session.status = 'accepted';  
    await session.save();

    res.json({ message: 'Session accepted.', session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Student pays for session (moves to scheduled)
router.post('/payment/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found." });

    session.status = "scheduled";
    session.isPaymentDone = true;
    await session.save();

    res.json({ message: "Session scheduled.", session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all sessions for a mentor
router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const sessions = await Session.find({ mentorId:mentorId });
    

    res.json({sessions});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/decline/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });

    // Delete session or mark as 'declined' (your choice)
    await Session.findByIdAndDelete(sessionId);

    res.json({ message: 'Session declined and removed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/join/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });

    // Example: mark session as 'in-progress' (optional)
    session.status = 'in-progress';  // Make sure your schema supports this field
    await session.save();

    res.json({ message: 'Session joined successfully.', session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//these are authiencated routes which i will update in future 

// // Create session
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { mentorId, topic, sessionType, scheduledTime } = req.body;
//     const mentor = await User.findById(mentorId);
//     if (!mentor || mentor.role !== "senior") return res.status(400).json({ message: "Invalid mentor" });
//     const session = new Session({
//       Student: req.user._id,
//       Mentor: mentorId,
//       college: mentor.college,
//       sessionType,
//       status: "pending",
//       startTime: scheduledTime,
//       amount: mentor.hourlyRate || 99,
//       paymentId: "pending",
//       messages: [],
//       notes: topic,
//     });
//     await session.save();
//     res.status(201).json({ session });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get a session by ID (with messages and participants)
// router.get("/:sessionId", authenticateToken, async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.sessionId)
//       .populate(["Student", "Mentor", { path: "messages.sender", select: "name profilePicture" }]);
//     if (!session) return res.status(404).json({ message: "Session not found" });

//     // Authorization: requester must be part of the session
//     if (session.Student.toString() !== req.user._id.toString() && session.Mentor.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     res.json({ session });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get sessions (filter by status/type)
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     const { status, type } = req.query;
//     const query = { $or: [{ Student: req.user._id }, { Mentor: req.user._id }] };
//     if (status) query.status = status;
//     if (type) query.sessionType = type;
//     const sessions = await Session.find(query).populate(["Student", "Mentor", "college"]).sort({ createdAt: -1 });
//     res.json({ sessions });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Update session status
// router.patch("/:sessionId/status", authenticateToken, async (req, res) => {
//   try {
//     const { status } = req.body;
//     const session = await Session.findById(req.params.sessionId);
//     if (!session) return res.status(404).json({ message: "Session not found" });
//     session.status = status;
//     await session.save();
//     res.json({ session });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Complete session (add rating/feedback)
// router.patch("/:sessionId/complete", authenticateToken, async (req, res) => {
//   try {
//     const { rating, feedback } = req.body;
//     const session = await Session.findById(req.params.sessionId);
//     if (!session) return res.status(404).json({ message: "Session not found" });
//     session.status = "completed";
//     session.notes = feedback;
//     await session.save();
//     // Optionally: update mentor's rating here
//     res.json({ session });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Send message in session
// router.post("/:sessionId/messages", authenticateToken, async (req, res) => {
//   try {
//     const { message, messageType = "text" } = req.body;
//     const session = await Session.findById(req.params.sessionId);
//     if (!session) return res.status(404).json({ message: "Session not found" });
//     session.messages.push({ sender: req.user._id, message, messageType });
//     await session.save();
//     res.json({ messages: session.messages });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

export default router; 