import { useState } from 'react';
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { GraduationCap, Users, Video, MessageCircle, Star, TrendingUp, Shield, Zap } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext.jsx";
import StudentDashboard from "../components/dashboard/StudentDashboard.jsx";
import MentorDashboard from "../components/dashboard/MentorDashboard.jsx";
import { authAPI } from "../components/auth/authModel.jsx";
import { motion } from "framer-motion";
import GoogleFormPopup from "../components/GoogleFormPopup.jsx"

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('signup');
  const { user, userRole } = useAuth();

  const handleAuthClick = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  if (user) {
    return userRole === 'student' ? <StudentDashboard /> : <MentorDashboard />;
  }

  const steps = [
    {
      title: "Choose Your College",
      description: "Select the college you're interested in and browse verified mentors",
      color: "bg-blue-600",
    },
    {
      title: "Connect & Pay",
      description: "Book a session with your chosen mentor for just ₹99",
      color: "bg-purple-600",
    },
    {
      title: "Get Guidance",
      description: "Video call or chat with your mentor to get authentic college insights",
      color: "bg-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CamCon
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => handleAuthClick('login')}>
              <a href="/login">Login</a>
            </Button>
            <Button onClick={() => handleAuthClick('signup')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <a href="/signup">Get Started</a>
            </Button>
          </div>
        </div>
      </header>

     <GoogleFormPopup triggerText="Apply Now" />

      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Badge className="mb-6 bg-blue-100 text-blue-400 border-blue-200">
            🎯 Trusted by 10,000+ Students
          </Badge>
          <motion.h1
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight"
          >
            Connect with College Seniors,<br />Make Informed Decisions
          </motion.h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get authentic insights from verified college seniors through real-time video calls and chats.
            Make the right college choice with guidance from those who've been there.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* <a href={userRole === "student" ? "/student/dashboard" : "/login"}> */}
            <a href="/student/dashboard">
              <Button
                size="lg"
                onClick={() => handleAuthClick('signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
              >
                Find Your Mentor
              </Button>
            </a>
            {/* </a> */}

            {/* <a href={userRole === "mentor" ? "/mentor/dashboard" : "/login"}> */}
            <a href="/mentor/dashboard">

              <Button
                size="lg"
                variant="outline"
                onClick={() => handleAuthClick('signup')}
                className="text-lg px-8 py-6 border-2"
              >
                Become a Mentor
              </Button>
            </a>
            {/* </a> */}
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose CamCon?</h2>
          <p className="text-xl text-gray-600">Everything you need to make the right college decision</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[{
            icon: <Video className="h-8 w-8 text-blue-600" />,
            title: "Live Video Calls",
            description: "Face-to-face conversations with verified seniors for authentic college insights",
            color: "blue-100",
            border: "blue-200"
          }, {
            icon: <MessageCircle className="h-8 w-8 text-purple-600" />,
            title: "Real-time Chat",
            description: "Instant messaging for quick questions and continuous support",
            color: "purple-100",
            border: "purple-200"
          }, {
            icon: <Shield className="h-8 w-8 text-green-600" />,
            title: "Verified Mentors",
            description: "All seniors are verified with college ID and academic credentials",
            color: "green-100",
            border: "green-200"
          }, {
            icon: <Star className="h-8 w-8 text-yellow-600" />,
            title: "Rating System",
            description: "Rate mentors and see reviews to find the perfect guide for your needs",
            color: "yellow-100",
            border: "yellow-200"
          }, {
            icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
            title: "Affordable Pricing",
            description: "Starting at just ₹99 per session - invest in your future affordably",
            color: "indigo-100",
            border: "indigo-200"
          }, {
            icon: <Zap className="h-8 w-8 text-red-600" />,
            title: "Instant Connect",
            description: "Connect with online mentors instantly for urgent college queries",
            color: "red-100",
            border: "red-200"
          }].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`p-6 hover:shadow-lg transition-shadow border-2 hover:border-${feature.border}`}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 bg-${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get the guidance you need</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div
                  className={`w-16 h-16 ${step.color} text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold`}
                >
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 py-20 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Make the Right Choice?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students who made informed college decisions with CamCon
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login">
              <Button
                size="lg"
                onClick={() => handleAuthClick('signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
              >
                Start Your Journey
              </Button>
            </a>

            <a href="/learnMore">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </motion.section>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 text-white py-12"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GraduationCap className="h-8 w-8" />
              <span className="text-2xl font-bold">CamCon</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© 2024 CamCon. Making college decisions easier.</p>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* {async ()=>{await authAPI.login("piyushsingh2706@gmail.com" , "piyush" ,"student")}} */}
    </div>
  );
};

export default Index;
