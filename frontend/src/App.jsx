import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "./components/ui/toaster.jsx";
import { useAuth } from './contexts/AuthContext.jsx';

import Index from './pages/Index';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import StudentDashboard from './components/dashboard/StudentDashboard';
import MentorDashboard from './components/dashboard/MentorDashboard';
import NotFound from './pages/NotFound';
import LearnMore from './pages/learnMore.jsx';
import StudentProfile from './components/Profile/StudentProfile.jsx';
import MentorChatPage from './pages/MentorChatSection.jsx';
import MentorProfilePage from './components/Profile/MentorProfile.jsx';
import GoogleFormPopup from './components/GoogleFormPopup.jsx'; // ✅ Popup component

// ✅ ProtectedRoute component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/learnMore" element={<LearnMore />} />

          {/* Optional: wrap these in <ProtectedRoute> if needed */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/mentor/profile" element={<MentorProfilePage />} />
          <Route path="/mentor/:id" element={<MentorChatPage />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* ✅ This is outside <Routes> so it appears on every page */}
        <GoogleFormPopup />

        {/* Toaster notifications */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
