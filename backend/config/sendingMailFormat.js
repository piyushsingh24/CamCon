import env from "dotenv"
import {EMAIL_VERIFY_TEMPLATE , PASSWORD_RESET_TEMPLATE , WELCOME_EMAIL_TEMPLATE} from "../config/emailTemplate.js"


env.config()

export const welcomeEmail = (email, name) => {
  const htmlContent = WELCOME_EMAIL_TEMPLATE.replace(/{{name}}/g, name);

  return {
    from: process.env.SENDER_MAIL,
    to: email,
    subject: "Welcome to CamCon 🎉",
    html: htmlContent
  };
};

//Sending a verifing Otp to user 
export const verifyOtpEmail = (User , otp) => {
  return {
    from: process.env.SENDER_MAIL,
    to: User.email,
    subject: "Verify User login",
    // text: `otp is ${otp} for verify the ${User.email} valid for 24 hours`,
    html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}" , otp).replace("{{email}}" , User.email)
  }
}

export const forgetPasswordOtp = (User, otp) => {
    return {
      from: process.env.SENDER_MAIL,
      to: User.email,
      subject: "Password Reset OTP",
      html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}" , otp).replace("{{email}}" , User.email)
      };
};

