import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
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
      enum: ["junior", "senior"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: function () {
        return this.role === "senior"
      },
    },
    // Senior-specific fields
    branch: {
      type: String,
      required: function () {
        return this.role === "senior"
      },
    },
    year: {
      type: Number,
      required: function () {
        return this.role === "senior"
      },
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    experience: {
      type: String,
      maxlength: 1000,
    },
    isAvailable: {
      type: Boolean,
      default: true,
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model("User", userSchema)
