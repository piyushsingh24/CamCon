import express from "express"
import jwt from "jsonwebtoken"
import Student from "../models/student.model.js";
import Mentor from "../models/mentor.model.js";
import transporter from '../config/nodemailer.js'
import { welcomeEmail, verifyOtpEmail, forgetPasswordOtp } from "../config/sendingMailFormat.js"



const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { role, name, email, password, college, branch, year, bio } = req.body;

    if (!role || !["student", "mentor"].includes(role.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // 🔎 Check existing in both collections
    const existingStudent = await Student.findOne({ email });
    const existingMentor = await Mentor.findOne({ email });

    if (existingStudent || existingMentor) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // ✨ Build model data
    let user;
    if (role.toLowerCase() === "student") {
      user = new Student({
        name,
        email,
        password,
        role
      });
    } else {
      user = new Mentor({
        name,
        email,
        password,
        college,
        branch,
        year,
        bio,
        role
      });
    }

    // 🔥 Generate OTP and assign to user
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 24 * 60 * 60 * 1000; // valid for 24 hours

    // 💾 Save the user with OTP
    await user.save();


    // ✅ Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: role.toLowerCase() },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    //its help to set the cookie
    res.cookie("token", token, {
      httpOnly: true, //only  http request can access this cookie 
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // maximum age or limit to store the cookie 
    })


    // 📧 Send Welcome Email (non-blocking)
    transporter.sendMail(welcomeEmail(user.email, user.name)).catch(err =>
      console.error("❌ Error sending welcome email:", err)
    );

    // 📧 Send OTP Email (non-blocking)
    transporter.sendMail(verifyOtpEmail(user, otp)).catch(err =>
      console.error("❌ Error sending verification email:", err)
    );

    // ✅ Success response
    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email with the OTP sent.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role.toLowerCase(),
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔎 Try finding the user in Student collection
    let user = await Student.findOne({ email });
    let role = "student";

    // If not found in Student, try Mentor
    if (!user) {
      user = await Mentor.findOne({ email });
      role = "mentor";
    }

    // If not found in both
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your account first.",
      });
    }

    // 🔑 Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🎟️ Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // 📨 Successful response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        college: user.college || null,
        branch: user.branch || null,
        year: user.year || null,
        profilePicture: user.profilePicture || "",
        isAvailable: user.isAvailable || false,
        rating: user.rating || { average: 0, count: 0 },
        isProfileCompleted: user.isProfileCompleted || false,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});


// // Get current user
// router.get("/me", async (req, res) => {
//   try {
//     const authHeader = req.headers["authorization"]
//     const token = authHeader && authHeader.split(" ")[1]

//     if (!token) {
//       return res.status(401).json({ message: "No token provided" })
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
//     const user = await User.findById(decoded.userId).select("-password").populate("college")

//     if (!user) {
//       return res.status(404).json({ message: "User not found" })
//     }

//     res.json({ user })
//   } catch (error) {
//     console.error("Get user error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })


//logout
// export const logout = (req, res) => {

//   try {
//     res.clearCookie('token', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict"
//     })

//     return res.status(200).json({
//       sucess: true, message: "User sucessfully logout"
//     })
//   } catch (error) {
//     res.status(401).json({ sucess: false, message: error.message })
//   }
// }

//verify the Mail 
// export const Verify = async (req, res) => {
//   try {
//     const { userId, otp } = req.body;

//     // Find the user
//     const user = await UserModel.findById(userId);

//     // If the user or OTP is missing, return an error
//     if (!user || !otp) {
//       return res.json({ success: false, message: "User not found! Please login again." });
//     }

//     // If the account is already verified, return a message
//     if (user.isAccountVerified) {
//       return res.json({ success: false, message: "Account is already verified." });
//     }

//     // Check if the OTP has expired
//     if (user.verifyOtpExpireAt < Date.now()) {
//       return res.json({ success: false, message: "OTP has expired. Please request a new one." });
//     }

//     // Verify the OTP
//     if (user.verifyOtp == otp) {
//       user.isAccountVerified = true;
//       user.verifyOtp = 0;
//       user.verifyOtpExpireAt = 0; // Reset OTP and expiry

//       // Save the updated user and send a response
//       await user.save();

//       return res.json({ success: true, message: "Account verified successfully!" });
//     } else {
//       return res.json({ success: false, message: "Incorrect OTP. Please try again." });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Server error, please try again later." });
//   }
// };

//forget password
// export const forgetPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Find user by email
//     const User = await UserModel.findOne({ email });
//     if (!User) {
//       return res.status(404).json({ sucess: false, message: "No user found, create an account" });
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);

//     // Set OTP and Expiration
//     User.resetOtp = otp;
//     User.resetOtpExprieAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

//     // Save updated user
//     await User.save();

//     // Send OTP email
//     await transporter.sendMail(forgetPasswordOtp(User, otp));

//     return res.status(200).json({ success: true, message: "OTP sent to your email" });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "An error occurred: " + error.message });
//   }
// };


//verifyForgetPassword
// export const verifyForgetPassword = async (req, res) => {
//   const { otp, email, newPassword } = req.body;

//   try {
//     // Check if required fields are missing
//     if (!otp || !email || !newPassword) {
//       return res.status(400).json({ success: false, message: "Data is Missing" });
//     }

//     // Find user by email
//     const User = await UserModel.findOne({ email });
//     if (!User) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Check if account is verified
//     if (!User.isAccountVerified) {
//       return res.status(400).json({
//         success: false,
//         message: "Account is not verified. Please verify your account first.",
//       });
//     }

//     // Verify OTP and check expiration
//     if (User.resetOtp != otp || User.resetOtpExprieAt < Date.now()) {
//       return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
//     }

//     // Check if the new password is the same as the old one
//     const isSamePassword = await brcrypt.compare(newPassword, User.password);
//     if (isSamePassword) {
//       return res.status(400).json({
//         success: false,
//         message: "New password cannot be the same as the current password",
//       });
//     }

//     // Hash the new password
//     const hashedPassword = await brcrypt.hash(newPassword, 10);
//     User.password = hashedPassword;

//     // Reset OTP and expiration fields
//     User.resetOtp = 0;
//     User.resetOtpExprieAt = 0;

//     // Save the user data
//     await User.save();

//     return res.status(200).json({
//       success: true,
//       message: "Password reset successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


// export const isauthenticed = async (req, res) => {
//   try {
//     res.json({ sucess: true })
//   } catch (error) {
//     res.json({ sucess: false, message: message.error })
//   }
// }

export default router
