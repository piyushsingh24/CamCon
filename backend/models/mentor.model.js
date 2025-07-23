import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    // 🔹 Basic details
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "mentor"],
      required: true,
    },

    // 🔹 Senior-specific details
    college: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
    },
    year: {
      type: Number,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    experience: {
      type: String,
      maxlength: 1000,
    },

    // 🔹 Profile & availability
    profilePicture: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    hourlyRate: {
      type: Number,
      default: 99,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // 🔹 Verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyOtp: {
      type: String,
    },
    verifyOtpExpiry: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//
// 🔑 Middleware: Hash password before save
//
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

//
// ✅ Method: Compare password for login
//
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


const Mentor =  mongoose.model("Mentor", userSchema);
export default Mentor;
