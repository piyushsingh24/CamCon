import express from "express";
import Mentor from "../models/mentor.model.js";  // Mentors are stored in User model

const router = express.Router();

// Get all verified mentors with completed profiles
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find({
      role: "mentor",
      isVerified: true,
    })
      .select("-password")
      .sort({ "rating.average": -1 });

    res.status(200).json({ mentors, total: mentors.length });
  } catch (error) {
    console.error("Get mentors error:", error);
    res.status(500).json({ message: "Unable to fetch mentors. Please try again later." });
  }
});

router.post("/me", async (req, res) => {
  const { mentor: mentorId } = req.body;

  if (!mentorId) return res.status(400).json({ error: "Mentor ID is required" });

  try {
    const mentor = await Mentor.findById(mentorId).select("-password");

    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    return res.status(200).json({ mentor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/college/:collegeId", async (req, res) => {
  try {
    const { collegeId } = req.params;

    const mentors = await Mentor.find({ college: collegeId, isVerified: true })
      .select("-password")
      .populate("college", "name");

    res.json({ mentors, total: mentors.length });
  } catch (error) {
    console.error("Error fetching mentors by college:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
