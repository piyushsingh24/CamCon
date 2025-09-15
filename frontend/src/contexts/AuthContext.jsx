import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(true); 
  // ✅ Check authentication status
  const checkAuth = async () => {
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("checkAuth user data:", data.user);
        setUser(data.user);
        return data.user;
      } else {
        console.warn("checkAuth failed, status:", response.status);
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("checkAuth error:", error);
      setUser(null);
      return null;
    } finally {
      console.log("checkAuth completed");
      setLoading(false);
      setIsChecking(false);
    }
  };

  // ✅ Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const userFromServer = await checkAuth();
      if (!userFromServer) {
        throw new Error("Failed to retrieve user after login");
      }

      const normalizedUser = {
        ...data.user,
        role:
          data.user.role === "student"
            ? "student"
            : data.user.role === "mentor"
              ? "mentor"
              : data.user.role,
      };

      setUser(normalizedUser);
      return { user: normalizedUser, token: data.token };
    } catch (error) {
      throw new Error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Signup
  const signup = async (
    email,
    password,
    name,
    role,
    college,
    extras = {}
  ) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role: role === "student" ? "student" : "mentor",
          college,
          ...extras,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      return { user: data.user, success: true };
    } catch (error) {
      throw new Error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const userRole = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        login,
        signup,
        logout,
        checkAuth,
        loading,
        setUser,
        isChecking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
