import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema(
  {
    junior: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senior: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    sessionType: {
      type: String,
      enum: ["chat", "video"],
      default: "chat",
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
      default: 99,
    },
    paymentId: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        messageType: {
          type: String,
          enum: ["text", "image", "file"],
          default: "text",
        },
      },
    ],
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Session", sessionSchema)
