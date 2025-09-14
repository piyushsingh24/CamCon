import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Mail, Loader, Eye, EyeOff } from "lucide-react";

const Resetpassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Expect userId & token to come via location.state or query params
  const { userId, token } = location.state || {};

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Password reset failed");
      }

      setSuccess(result.message);
      reset();

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">CC</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">CamCon</span>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter your new password to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-5" />
                  <input
                    type={show ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full border rounded px-3 py-2"
                    {...register("password", { required: "Please enter your password", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                  />
                  {show ? (
                    <Eye className="w-5 cursor-pointer" onClick={() => setShow(false)} />
                  ) : (
                    <EyeOff className="w-5 cursor-pointer" onClick={() => setShow(true)} />
                  )}
                </div>
                {errors.password && <p className="text-red-500 text-sm">{"! " + errors.password.message}</p>}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600" disabled={loading}>
                {loading ? <Loader className="animate-spin w-5 h-5" /> : "Reset Password"}
              </Button>
              <div className="text-center text-sm text-gray-600">
                Remembered your password? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resetpassword;
