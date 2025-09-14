import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Mail, KeyRound, Lock, Loader } from "lucide-react";

const ForgetResetPassword = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP & reset password
  const [email, setEmail] = useState("");

  const navigate = useNavigate();


  // Step 1: Send OTP
  const sendOtp = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
          credentials: "include",
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);

      setEmail(data.email);
      setSuccess(result.message || "OTP sent to your email.");
      reset();
      setStep(2); // switch UI to OTP & reset password
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & reset password
  const verifyOtp = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (data.newPassword !== data.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-forget-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp: data.otp,
            newPassword: data.newPassword,
          }),
          credentials: "include",
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);

      setSuccess(result.message || "Password reset successful!");
      reset();
      setStep(1); // reset UI to step 1 if user wants to reset again
      setEmail("");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">CC</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              CamCon
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === 1 ? "Forgot Password" : "Verify & Reset Password"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Enter your registered email to receive OTP"
                : "Enter the OTP and your new password"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(step === 1 ? sendOtp : verifyOtp)}
              className="space-y-4"
            >
              {/* Step 1: Email */}
              {step === 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5" />
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className="w-full border rounded px-3 py-2"
                      {...register("email", {
                        required: "Please enter your email",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{"! " + errors.email.message}</p>
                  )}
                </div>
              )}

              {/* Step 2: OTP + New Password + Confirm */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">OTP</label>
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-5" />
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full border rounded px-3 py-2"
                        {...register("otp", { required: "Please enter OTP" })}
                      />
                    </div>
                    {errors.otp && <p className="text-red-500 text-sm">{"! " + errors.otp.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <div className="flex items-center gap-2">
                      <Lock className="w-5" />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full border rounded px-3 py-2"
                        {...register("newPassword", {
                          required: "Please enter new password",
                          minLength: { value: 6, message: "Password must be at least 6 characters" },
                        })}
                      />
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-sm">{"! " + errors.newPassword.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <div className="flex items-center gap-2">
                      <Lock className="w-5" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full border rounded px-3 py-2"
                        {...register("confirmPassword", { required: "Please confirm new password" })}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{"! " + errors.confirmPassword.message}</p>}
                  </div>
                </>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin w-5 h-5" /> : step === 1 ? "Send OTP" : "Reset Password"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Remembered your password?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgetResetPassword;
