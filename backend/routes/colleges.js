import express from "express"
import College from "../models/College.js"
import User from "../models/User.js"

const router = express.Router()


// Get all active colleges at once
router.get("/", async (req, res) => {
  try {
    const colleges = await College.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ colleges, total: colleges.length });
  } catch (error) {
    console.error("Get colleges error:", error);
    res.status(500).json({ message: "Unable to fetch colleges. Please try again later." });
  }
});



// Get college by ID with available seniors
router.get("/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
    if (!college) {
      return res.status(404).json({ message: "College not found" })
    }

    // Get available seniors from this college
    const seniors = await User.find({
      college: req.params.id,
      role: "senior",
      isAvailable: true,
      isVerified: true,
    })
      .select("-password")
      .populate("college")
      .sort({ "rating.average": -1 })

    res.json({ college, seniors })
  } catch (error) {
    console.error("Get college error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get seniors by college
router.get("/:id/seniors", async (req, res) => {
  try {
    const { branch, sortBy = "rating" } = req.query

    const query = {
      college: req.params.id,
      role: "senior",
      isVerified: true,
    }

    if (branch) {
      query.branch = branch
    }

    let sortQuery = {}
    switch (sortBy) {
      case "rating":
        sortQuery = { "rating.average": -1 }
        break
      case "experience":
        sortQuery = { year: -1 }
        break
      case "availability":
        sortQuery = { isAvailable: -1 }
        break
      default:
        sortQuery = { "rating.average": -1 }
    }

    const seniors = await User.find(query).select("-password").populate("college").sort(sortQuery)

    res.json({ seniors })
  } catch (error) {
    console.error("Get seniors error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
