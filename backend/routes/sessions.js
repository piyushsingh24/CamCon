import express from "express";
import Session from "../models/Session.js";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Create session
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { mentorId, topic, sessionType, scheduledTime } = req.body;
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "senior") return res.status(400).json({ message: "Invalid mentor" });
    const session = new Session({
      junior: req.user._id,
      senior: mentorId,
      college: mentor.college,
      sessionType,
      status: "pending",
      startTime: scheduledTime,
      amount: mentor.hourlyRate || 99,
      paymentId: "pending",
      messages: [],
      notes: topic,
    });
    await session.save();
    res.status(201).json({ session });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get sessions (filter by status/type)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = { $or: [{ junior: req.user._id }, { senior: req.user._id }] };
    if (status) query.status = status;
    if (type) query.sessionType = type;
    const sessions = await Session.find(query).populate(["junior", "senior", "college"]).sort({ createdAt: -1 });
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update session status
router.patch("/:sessionId/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    session.status = status;
    await session.save();
    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Complete session (add rating/feedback)
router.patch("/:sessionId/complete", authenticateToken, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    session.status = "completed";
    session.notes = feedback;
    await session.save();
    // Optionally: update mentor's rating here
    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send message in session
router.post("/:sessionId/messages", authenticateToken, async (req, res) => {
  try {
    const { message, messageType = "text" } = req.body;
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    session.messages.push({ sender: req.user._id, message, messageType });
    await session.save();
    res.json({ messages: session.messages });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router; 