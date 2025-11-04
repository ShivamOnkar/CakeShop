import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

// Create Auth Context
const AuthContext = createContext();

// API Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Define API endpoints
  const API_ENDPOINTS = {
    AUTH: {
      LOGIN: `${API_BASE_URL}/auth/login`,
      REGISTER: `${API_BASE_URL}/auth/register`,
      PROFILE: `${API_BASE_URL}/auth/profile`,
    },
    USERS: {
      PROFILE: `${API_BASE_URL}/users/profile`,
      ADDRESSES: `${API_BASE_URL}/users/addresses`,
    },
    ADMIN: {
      DASHBOARD_STATS: `${API_BASE_URL}/admin/dashboard/stats`,
      ORDERS: `${API_BASE_URL}/admin/orders`,
    },
  };

  // ✅ Helper function for API calls
  const makeApiCall = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.message || `API request failed: ${response.status}`);
    }

    return data;
  }, []);

  // ✅ Auto login check when app starts or refreshes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const res = await makeApiCall(API_ENDPOINTS.AUTH.PROFILE);
        const userData = res.user || res;

        // Ensure _id exists
        if (!userData || !userData._id) {
          console.warn("⚠️ Invalid user data from /auth/profile:", userData);
          localStorage.removeItem("token");
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        console.log("✅ Logged in user:", userData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error.message);
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [makeApiCall]);

  // ✅ Login
  const login = useCallback(
    async (email, password) => {
      try {
        const res = await makeApiCall(API_ENDPOINTS.AUTH.LOGIN, {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        const token = res.token || res.accessToken;
        const userData = res.user || res;

        if (token) localStorage.setItem("token", token);
        if (userData && userData._id) {
          setUser(userData);
          setIsAuthenticated(true);
        }

        return { success: true, data: userData };
      } catch (error) {
        console.error("Login failed:", error.message);
        return { success: false, error: error.message };
      }
    },
    [makeApiCall]
  );

  // ✅ Admin Login
  const adminLogin = useCallback(
    async (email, password) => {
      try {
        const res = await makeApiCall(API_ENDPOINTS.AUTH.LOGIN, {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        const token = res.token || res.accessToken;
        const userData = res.user || res;

        if (!userData || userData.role !== "admin") {
          return {
            success: false,
            error: "Access denied. Admin privileges required.",
          };
        }

        localStorage.setItem("token", token);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, data: userData };
      } catch (error) {
        console.error("Admin login failed:", error.message);
        return { success: false, error: error.message };
      }
    },
    [makeApiCall]
  );

  // ✅ Register
  const register = useCallback(
    async ({ name, email, password, phone }) => {
      try {
        const res = await makeApiCall(API_ENDPOINTS.AUTH.REGISTER, {
          method: "POST",
          body: JSON.stringify({ name, email, password, phone }),
        });

        const token = res.token || res.accessToken;
        const userData = res.user || res;

        if (token) localStorage.setItem("token", token);
        if (userData && userData._id) {
          setUser(userData);
          setIsAuthenticated(true);
        }

        return { success: true, data: userData };
      } catch (error) {
        console.error("Registration failed:", error.message);
        return { success: false, error: error.message };
      }
    },
    [makeApiCall]
  );

  // ✅ Logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ✅ Admin checks
  const isAdmin = useCallback(() => user?.role === "admin", [user]);

  // ✅ Profile & Addresses
  const updateProfile = useCallback(
    async (data) => {
      try {
        const updatedUser = await makeApiCall(API_ENDPOINTS.USERS.PROFILE, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        setUser(updatedUser);
        return { success: true, data: updatedUser };
      } catch (error) {
        console.error("Update profile failed:", error.message);
        return { success: false, error: error.message };
      }
    },
    [makeApiCall]
  );

  const getAddresses = useCallback(async () => {
    try {
      const res = await makeApiCall(API_ENDPOINTS.USERS.ADDRESSES);
      return { success: true, data: res.addresses || res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [makeApiCall]);

  const addAddress = useCallback(
    async (address) => {
      try {
        const res = await makeApiCall(API_ENDPOINTS.USERS.ADDRESSES, {
          method: "POST",
          body: JSON.stringify(address),
        });
        setUser((prev) => (prev ? { ...prev, addresses: res.addresses } : null));
        return { success: true, data: res.addresses };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [makeApiCall]
  );

  // ✅ Provide context value
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    adminLogin,
    register,
    logout,
    updateProfile,
    isAdmin,
    getAddresses,
    addAddress,
    makeApiCall,
    API_ENDPOINTS,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
