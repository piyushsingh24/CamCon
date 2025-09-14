import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../contexts/ToastContext.jsx";
import { useAuth } from "../contexts/AuthContext";
import { GraduationCap, Users } from "lucide-react";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "student";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: initialRole,
    college: "",
    branch: "",
    year: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendRole = formData.role === "student" ? "student" : "mentor";
      let payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: backendRole,
      };

      if (formData.role === "mentor") {
        payload = {
          ...payload,
          college: formData.college,
          branch: formData.branch,
          year: formData.year,
          bio: formData.bio,
        };
      }

      const result = await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.college,
        formData.role === "mentor" ? { branch: formData.branch, year: formData.year, bio: formData.bio } : {}
      );

      if (result.success && result.user) {
        const backendRole = result.user.role;
        navigate("/verify-email", { state: { userId: result.user.id || result.user._id, role: backendRole } });
        return;
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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
            <CardTitle className="text-2xl">Join CamCon</CardTitle>
            <CardDescription>Create your account and start connecting with peers</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role */}
              <div className="space-y-3">
                <p className="text-base font-medium">I am a...</p>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <label
                    htmlFor="student"
                    className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-blue-50 cursor-pointer"
                  >
                    <RadioGroupItem value="student" id="student" />
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">College Aspirant</p>
                      <p className="text-sm text-gray-500">Looking for guidance</p>
                    </div>
                  </label>

                  <label
                    htmlFor="mentor"
                    className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-orange-50 cursor-pointer"
                  >
                    <RadioGroupItem value="mentor" id="mentor" />
                    <Users className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">College Student</p>
                      <p className="text-sm text-gray-500">Want to help others</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              {/* Mentor-specific */}
              {formData.role === "mentor" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="college" className="text-sm font-medium">Current College</label>
                      <input
                        id="college"
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter your college name"
                        value={formData.college}
                        onChange={(e) => handleInputChange("college", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="branch" className="text-sm font-medium">Current Branch</label>
                      <input
                        id="branch"
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter your branch"
                        value={formData.branch}
                        onChange={(e) => handleInputChange("branch", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="year" className="text-sm font-medium">Current Year</label>
                      <Select onValueChange={(value) => handleInputChange("year", value)} value={formData.year}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1nd">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                          <SelectItem value="graduate">5th year</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="block">
                      <label htmlFor="bio" className="text-sm font-medium">Bio (Optional)</label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your experience, achievements, and what you can help with..."
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
