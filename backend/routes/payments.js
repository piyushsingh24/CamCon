// import express from "express"
// import Razorpay from "razorpay"
// import crypto from "crypto"
// import Payment from "../models/Payment.js"
// import Session from "../models/Session.js"

// const router = express.Router()

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || "your_key_id",
//   key_secret: process.env.RAZORPAY_KEY_SECRET || "your_key_secret",
// })

// // Create payment order
// router.post("/create-order", async (req, res) => {
//   try {
//     const { seniorId, amount = 99 } = req.body
//     const juniorId = req.user._id

//     // Verify senior exists and is available
//     const senior = await User.findById(seniorId)
//     if (!senior || senior.role !== "senior" || !senior.isAvailable) {
//       return res.status(400).json({ message: "Senior not available" })
//     }

//     // Create Razorpay order
//     const options = {
//       amount: amount * 100, // amount in paise
//       currency: "INR",
//       receipt: `session_${Date.now()}`,
//       notes: {
//         juniorId: juniorId.toString(),
//         seniorId: seniorId.toString(),
//       },
//     }

//     const order = await razorpay.orders.create(options)

//     res.json({
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       key: process.env.RAZORPAY_KEY_ID,
//     })
//   } catch (error) {
//     console.error("Create order error:", error)
//     res.status(500).json({ message: "Failed to create payment order" })
//   }
// })

// // Verify payment and create session
// router.post("/verify", async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, seniorId } = req.body

//     const juniorId = req.user._id

//     // Verify signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "your_key_secret")
//       .update(body.toString())
//       .digest("hex")

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid payment signature" })
//     }

//     // Get senior details
//     const senior = await User.findById(seniorId).populate("college")
//     if (!senior) {
//       return res.status(400).json({ message: "Senior not found" })
//     }

//     // Create session
//     const session = new Session({
//       junior: juniorId,
//       senior: seniorId,
//       college: senior.college._id,
//       amount: 99,
//       paymentId: razorpay_payment_id,
//       status: "pending",
//     })

//     await session.save()

//     // Create payment record
//     const payment = new Payment({
//       user: juniorId,
//       session: session._id,
//       amount: 99,
//       paymentMethod: "razorpay",
//       paymentId: razorpay_payment_id,
//       orderId: razorpay_order_id,
//       status: "completed",
//       transactionDetails: {
//         signature: razorpay_signature,
//       },
//     })

//     await payment.save()

//     // Populate session details
//     await session.populate(["junior", "senior", "college"])

//     res.json({
//       message: "Payment verified successfully",
//       session: session,
//     })
//   } catch (error) {
//     console.error("Payment verification error:", error)
//     res.status(500).json({ message: "Payment verification failed" })
//   }
// })

// // Get payment history
// router.get("/history", async (req, res) => {
//   try {
//     const userId = req.user._id
//     const { page = 1, limit = 10 } = req.query

//     const payments = await Payment.find({ user: userId })
//       .populate({
//         path: "session",
//         populate: {
//           path: "senior college",
//           select: "name college.name",
//         },
//       })
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)

//     const total = await Payment.countDocuments({ user: userId })

//     res.json({
//       payments,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//     })
//   } catch (error) {
//     console.error("Get payment history error:", error)
//     res.status(500).json({ message: "Failed to fetch payment history" })
//   }
// })

// export default router
