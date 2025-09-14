import express from "express"
import jwt from "jsonwebtoken"
import Student from "../models/student.model.js";
import Mentor from "../models/mentor.model.js";
import transporter from '../config/nodemailer.js'
import { welcomeEmail, verifyOtpEmail, forgetPasswordOtp } from "../config/sendingMailFormat.js"
import bcrypt from "bcryptjs";


const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { role, name, email, password, college, branch, year, bio } = req.body;

    if (!role || !["student", "mentor"].includes(role.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    //  Check existing in both collections
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

    // Generate OTP and assign to user
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

    // ✅ Success response (also include token in body for SPA localStorage)
    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email with the OTP sent.",
      // token, ---------> write now we don't want to send the token in the lcoalstorage
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
        userId: user._id,
        role,
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

    //its help to set the cookie
    res.cookie("token", token, {
      httpOnly: true, //only  http request can access this cookie 
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // maximum age or limit to store the cookie 
    })


    // 📨 Successful response (also include token in body)
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

//verify the Mail 
router.post("/verify", async (req, res) => {
  try {
    const { userId, otp, role } = req.body;

    // Validate Input
    if (!userId || !otp || !role) {
      return res.status(400).json({
        success: false,
        message: "Invalid Details or OTP",
      });
    }

    // Select model based on role
    let Model;
    if (role === "student") {
      Model = Student;
    } else if (role === "mentor") {
      Model = Mentor;
    } else {
      return res.status(400).json({
        success: false,
        message: " Invalid Details. ",
      });
    }

    // Fetch User from respective model
    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register again.",
      });
    }

    // Already verified check
    if (user.isVerified) {
      return res.status(200).json({
        success: false,
        message: " Account is already verified.",
      });
    }

    // OTP expiration check
    if (user.verifyOtpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Compare OTP
    if (user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    // OTP valid — update account
    user.isVerified = true;
    user.verifyOtp = 0;
    user.verifyOtpExpire = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account verified successfully! `,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// RESEND OTP ROUTE
router.post("/resend-otp", async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or role",
      });
    }

    // Select model
    let Model;
    if (role === "student") {
      Model = Student;
    } else if (role === "mentor") {
      Model = Mentor;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Find user
    const user = await Model.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register again.",
      });
    }

    // Already verified?
    if (user.isVerified) {
      return res.status(200).json({
        success: false,
        message: "Account already verified.",
      });
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit string
    const expiry = Date.now() + 10 * 60 * 1000;

    user.verifyOtp = newOtp;
    user.verifyOtpExpiry = expiry;
    await user.save();


    // 📧 Send OTP Email (non-blocking)
    transporter.sendMail(verifyOtpEmail(user, newOtp)).catch(err =>
      console.error("❌ Error sending verification email:", err)
    );


    return res.status(200).json({
      success: true,
      message: "OTP resent successfully. Please check your email.",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

//logout
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict"
    })

    return res.status(200).json({
      sucess: true, message: "User sucessfully logout"
    })
  } catch (error) {
    res.status(401).json({ sucess: false, message: error.message })
  }
})

//forget password otp sent
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // 🔎 Check in both collections
    let user = await Student.findOne({ email });
    let userRole = "student";
    if (!user) {
      user = await Mentor.findOne({ email });
      userRole = "mentor";
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email is not verified. Please verify your account first."
      });
    }

    //  Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //  Save OTP (valid for 24 hours)
    user.resetPasswordToken = otp;
    user.resetPasswordExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    //  Send OTP email (non-blocking)
    transporter
      .sendMail(forgetPasswordOtp(user, otp))
      .then(() => console.log(`📧 Forgot password OTP sent to ${user.email}`))
      .catch((err) => console.error("❌ Error sending OTP email:", err));

    //  Respond
    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Check your email.",
      role: userRole,
    });
  } catch (err) {
    console.error("❌ Forget password route error:", err);
    res.status(500).json({ success: false, message: "Server error during forgot password" });
  }
});

//verifyForgetPassword
router.post("/verify-forget-password", async (req, res) => {
  const { otp, email, newPassword } = req.body;

  try {
    // 🛠 Validate input
    if (!otp || !email || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 🔎 Search in both collections
    let user = await Student.findOne({ email });
    let role = "student";
    if (!user) {
      user = await Mentor.findOne({ email });
      role = "mentor";
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Check if account is verified
    if (user.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "Account is not verified. Please verify your account first.",
      });
    }



    if (user.resetPasswordExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.resetPasswordToken !== otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is Wrong please Try again !"
      })
    }

    // 🔒 Check if new password is same as old one
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as your current password",
      });
    }

    // 🔑 Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // ♻️ Clear OTP fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    // 💾 Save updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      role,
    });
  } catch (error) {
    console.error("❌ verifyForgetPassword error:", error);
    return res.status(500).json({ success: false, message: "Server error during password reset" });
  }
});


// Get current user based on token 
router.get("/me", async (req, res) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    let user = await Student.findById(decoded.userId)
      .select("-password")

    // If not found in Student, check Mentor
    if (!user) {
      user = await Mentor.findById(decoded.userId)
        .select("-password")
        .populate("college");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Check if authenticated
router.get("/isauthenticated", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.json({ success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    if (!decoded?.userId) {
      return res.json({ success: false });
    }

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
})


export default router



//work for localstorage 

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
