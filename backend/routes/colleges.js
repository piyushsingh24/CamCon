import express from "express"
import College from "../models/College.js"
import User from "../models/User.js"

const router = express.Router()

// Get all colleges
router.get("/", async (req, res) => {
  try {
    const { search, type, state } = req.query
    const query = { isActive: true }

    if (search) {
      query.name = { $regex: search, $options: "i" }
    }

    if (type) {
      query.type = type
    }

    if (state) {
      query["location.state"] = state
    }

    const colleges = await College.find(query).sort({ name: 1 })
    res.json({ colleges })
  } catch (error) {
    console.error("Get colleges error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

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
