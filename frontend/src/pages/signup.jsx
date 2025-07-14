import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast.js";
import { GraduationCap, Users } from "lucide-react";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "junior";

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
  const { toast } = useToast();

  const colleges = [
    "IIT Delhi", "IIT Bombay", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
    "NIT Trichy", "NIT Warangal", "BITS Pilani", "VIT Vellore", "SRM Chennai",
    "Delhi University", "Jawaharlal Nehru University", "Banaras Hindu University"
  ];

  const branches = [
    "Computer Science", "Electronics & Communication", "Mechanical", "Civil",
    "Electrical", "Chemical", "Biotechnology", "Aerospace", "Information Technology"
  ];


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    //send the ***payload*** to the server not the formData 

    try {
      // Create the payload conditionally based on role
      let payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "senior") {
        payload = {
          ...payload,
          college: formData.college,
          branch: formData.branch,
          year: formData.year,
          bio: formData.bio,
        };
      }

      // Send the data to the backend
      const response = 
      
      // await  fetch("https://your-backend-url.com/api/signup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to sign up");
      // }

      // const data = await response.json();

      // Success toast
      toast({
        title: "Account Created Successfully!",
        description: `Welcome to CamCon, ${formData.name}!`,
      });

      console.log(payload)
      
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.log(payload)
      // console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
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
              <div className="space-y-3">
                <p className="text-base font-medium">I am a...</p>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-blue-50 cursor-pointer">
                    <RadioGroupItem value="junior" id="junior" />
                    <label htmlFor="junior" className="flex items-center space-x-2 cursor-pointer">
                      <GraduationCap className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">College Aspirant</p>
                        <p className="text-sm text-gray-500">Looking for guidance</p>
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-orange-50 cursor-pointer">
                    <RadioGroupItem value="senior" id="senior" />
                    <label htmlFor="senior" className="flex items-center space-x-2 cursor-pointer">
                      <Users className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">College Student</p>
                        <p className="text-sm text-gray-500">Want to help others</p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

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

              {formData.role === "senior" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="college" className="text-sm font-medium">Current College</label>
                    <Select onValueChange={(value) => handleInputChange("college", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                      <SelectContent>
                        {colleges.map((college) => (
                          <SelectItem key={college} value={college}>{college}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="branch" className="text-sm font-medium">Current Branch</label>
                    <Select onValueChange={(value) => handleInputChange("branch", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}


              {formData.role === "senior" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="year" className="text-sm font-medium">Current Year</label>
                    <Select onValueChange={(value) => handleInputChange("year", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">4th Year</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
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
