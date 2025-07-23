import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get mentors (optionally filter by college and search)
router.get("/mentors", authenticateToken, async (req, res) => {
  try {
    const { college, search } = req.query;
    const query = { role: "senior", isVerified: true };
    if (college) query.college = college;
    if (search) query.name = { $regex: search, $options: "i" };
    const mentors = await User.find(query).select("-password").populate("college").sort({ "rating.average": -1 });
    res.json({ mentors });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get online mentors (optionally filter by college)
router.get("/mentors/online", authenticateToken, async (req, res) => {
  try {
    const { college } = req.query;
    const query = { role: "senior", isVerified: true, isAvailable: true };
    if (college) query.college = college;
    const mentors = await User.find(query).select("-password").populate("college").sort({ "rating.average": -1 });
    res.json({ mentors });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle mentor availability
router.patch("/availability", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "senior") return res.status(403).json({ message: "Not a mentor" });
    user.isAvailable = !user.isAvailable;
    await user.save();
    res.json({ isAvailable: user.isAvailable });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router; 