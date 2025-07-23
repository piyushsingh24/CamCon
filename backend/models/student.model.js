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
    bio: {
      type: String,
      maxlength: 500,
    },
    
    // 🔹 Profile & availability
    profilePicture: {
      type: String,
      default: "",
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
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

//
// ✅ Method: Generate OTP for email/phone verification
//
userSchema.methods.generateOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6‑digit OTP
  this.verifyOtp = otp;
  this.verifyOtpExpiry = Date.now() + 10 * 60 * 1000; // valid for 10 min
  return otp;
};

//
// ✅ Method: Validate OTP
//
userSchema.methods.validateOtp = function (inputOtp) {
  return (
    this.verifyOtp === inputOtp && this.verifyOtpExpiry && this.verifyOtpExpiry > Date.now()
  );
};

//
// ✅ Method: Generate password reset token
//
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // valid for 10 min
  return resetToken; // send this token via email
};

//
// ✅ Method: Validate reset token (you'll hash input before comparing)
//
userSchema.methods.validateResetToken = function (token) {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  return (
    this.resetPasswordToken === hashed &&
    this.resetPasswordExpiry &&
    this.resetPasswordExpiry > Date.now()
  );
};

const Student =  mongoose.model("Student", userSchema);
export default Student;
