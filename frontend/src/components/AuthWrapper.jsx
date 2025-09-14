import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// ✅ Full screen loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-lg text-gray-600">Loading...</p>
    </div>
  </div>
);

export const AuthWrapper = ({
  children,
  requireAuth = false,
  allowedRoles = [],
}) => {
  const { user, loading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // 🔄 Run checkAuth only once when auth is loading is done
  useEffect(() => {
    const verifyAuth = async () => {
      if (!loading) {
        try {
          await checkAuth(); // ensure token/session is valid
        } catch (error) {
          console.error("Auth check failed:", error);
        } finally {
          setIsChecking(false);
        }
      }
    };
    verifyAuth();
  }, [loading, checkAuth]);

  // 🚀 Handle all redirects
  useEffect(() => {
    if (loading || isChecking) return;

    // 1️⃣ Protected route, but user not logged in
    if (requireAuth && !user) {
      navigate("/login", {
        state: { returnUrl: location.pathname }, // save return path
        replace: true,
      });
      return;
    }

    // 2️⃣ Role-specific protection
    if (
      requireAuth &&
      allowedRoles.length > 0 &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else if (user.role === "mentor") {
        navigate("/mentor/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
      return;
    }

    // 3️⃣ Already logged in but on public routes (/login, /signup)
    if (
      user &&
      !requireAuth &&
      ["/login", "/signup", "/verify-email"].includes(location.pathname)
    ) {
      if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else if (user.role === "mentor") {
        navigate("/mentor/dashboard", { replace: true });
      }
      return;
    }

    // 4️⃣ Logged in and on homepage → redirect to dashboard
    if (user && location.pathname === "/") {
      if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else if (user.role === "mentor") {
        navigate("/mentor/dashboard", { replace: true });
      }
    }
  }, [
    user,
    loading,
    isChecking,
    requireAuth,
    allowedRoles,
    location.pathname,
    navigate,
  ]);

  // ⏳ While checking auth or fetching session
  if (loading || isChecking) {
    return <LoadingSpinner />;
  }

  return children;
};

// ✅ Optional HOC wrapper if you want
export const withAuth = (Component, requireAuth = false, allowedRoles = []) => {
  return function AuthenticatedComponent(props) {
    return (
      <AuthWrapper requireAuth={requireAuth} allowedRoles={allowedRoles}>
        <Component {...props} />
      </AuthWrapper>
    );
  };
};

export default AuthWrapper;
