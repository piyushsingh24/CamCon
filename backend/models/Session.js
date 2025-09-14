import mongoose from "mongoose"
import { type } from "os"

const sessionSchema = new mongoose.Schema(
  {
    studentId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student', 
      required: true 
    },
    mentorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Mentor', 
      required: true 
    },
    studentName:{
      type:String,
      default:"Student"
    },
    mentorName:{
      type : String,
      default:"Mentor"
    },
    status: {
      type: String,
      enum: ["requested" , "accepted", "rejected", "ongoing", "completed", "scheduled"],
      default: "pending",
    },
    amount: {
      type: Number,
      default: 99,
    },
    isPaymentDone:{
      type:Boolean,
      default:false,
    },
    paymentId: {
      type: String,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Session", sessionSchema)
