import { SimpleToaster } from "./components/ui/simple-toast.jsx";
import { AuthWrapper } from "./components/AuthWrapper.jsx";
import { useAuth } from "./contexts/AuthContext.jsx"
import { Routes, Route, Navigate } from "react-router-dom";


// Pages & Components
import Index from "./pages/Index";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import StudentDashboard from "./components/dashboard/StudentDashboard.jsx";
import MentorDashboard from "./components/dashboard/MentorDashboard.jsx";
import NotFound from "./pages/NotFound";
import LearnMore from "./pages/LearnMore.jsx";
import StudentProfile from "./components/Profile/StudentProfile.jsx";
import MentorChatPage from "./pages/MentorChatSection.jsx";

import MentorProfilePage from "./components/Profile/MentorProfile.jsx";
import Forgetpassword from "./pages/ForgetPassword.jsx";
import CheckoutPage from "./pages/Checkout.jsx";
import MentorDataPage from "./pages/MentorPage.jsx";
import CallPage from "./pages/CallPage.jsx"

function App() {

   const { user, loading } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };


  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* ✅ Public Routes */}
        <Route
          path="/"
          element={
            <AuthWrapper requireAuth={false}>
              <Index />
            </AuthWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <AuthWrapper requireAuth={false}>
              <Login />
            </AuthWrapper>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthWrapper requireAuth={false}>
              <Signup />
            </AuthWrapper>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthWrapper requireAuth={false}>
              <VerifyEmail />
            </AuthWrapper>
          }
        />
         <Route
          path="/forgot-password"
          element={
            <AuthWrapper requireAuth={false}>
              <Forgetpassword />
            </AuthWrapper>
          }
        />
        <Route
          path="/learnMore"
          element={
            <AuthWrapper requireAuth={false}>
              <LearnMore />
            </AuthWrapper>
          }
        />

        {/* ✅ Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <AuthWrapper requireAuth={true} allowedRoles={["student"]}>
              <StudentDashboard />
            </AuthWrapper>
          }
        />
        <Route
          path="/student/profile"
          element={
            <AuthWrapper requireAuth={true} allowedRoles={["student"]}>
              <StudentProfile />
            </AuthWrapper>
          }
        />

        {/* ✅ Mentor Routes */}
        <Route
          path="/mentor/dashboard"
          element={
            <AuthWrapper requireAuth={true} allowedRoles={["mentor"]}>
              <MentorDashboard />
            </AuthWrapper>
          }
        />
        <Route
          path="/mentor/profile"
          element={
            <AuthWrapper requireAuth={true} allowedRoles={["mentor"]}>
              <MentorProfilePage />
            </AuthWrapper>
          }
        />

        <Route
          path="/mentor/data/:mentorId"
          element={
            <AuthWrapper requireAuth={true}>
              <MentorDataPage />
            </AuthWrapper>
          }
        />

        <Route
          path="/payment/:sessionId"
          element={
            <AuthWrapper requireAuth={true}>
              <CheckoutPage />
            </AuthWrapper>
          }
        />   
        {/* //chat  */}
        <Route
          path="/mentor/:sessionId"
          element={
            <AuthWrapper requireAuth={true}>
              <MentorChatPage />
            </AuthWrapper>
          }
        />   

        <Route
          path="call/:sessionId"
          element={
            <AuthWrapper requireAuth={true}>
              <CallPage />
            </AuthWrapper>
          }
        />     

        
        {/* ✅ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ✅ Toast Notifications */}
      <SimpleToaster />
    </div>
  );
}

export default App;
