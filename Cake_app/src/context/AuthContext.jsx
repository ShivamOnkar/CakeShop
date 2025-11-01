import React, { createContext, useState, useContext, useEffect } from "react";

// Create Auth Context
const AuthContext = createContext();

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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

  // ✅ Helper function for API calls (auto includes token)
  const makeApiCall = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      throw new Error(data.message || "API request failed");
    }

    return data;
  };

  // ✅ Check login state when app starts or refreshes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await makeApiCall(API_ENDPOINTS.AUTH.PROFILE);
          setUser(userData.user || userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // ✅ User login
  const login = async (email, password) => {
    try {
      const userData = await makeApiCall(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token = userData.token || userData.accessToken;
      if (token) localStorage.setItem("token", token);

      setUser(userData.user || userData);
      setIsAuthenticated(true);
      return { success: true, data: userData };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Admin login (checks role)
  const adminLogin = async (email, password) => {
    try {
      const res = await makeApiCall(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const user = res.user || res;
      const token = res.token || res.accessToken;

      if (!user || !token) {
        return { success: false, error: "Invalid response from server" };
      }

      if (user.role !== "admin") {
        return { success: false, error: "Access denied. Admin privileges required." };
      }

      localStorage.setItem("token", token);
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, data: user };
    } catch (error) {
      console.error("Admin login failed:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Register new user
  const register = async ({ name, email, password, phone }) => {
    try {
      const userData = await makeApiCall(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify({ name, email, password, phone }),
      });

      const token = userData.token || userData.accessToken;
      if (token) localStorage.setItem("token", token);

      setUser(userData.user || userData);
      setIsAuthenticated(true);
      return { success: true, data: userData };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // ✅ Check if admin
  const isAdmin = () => user?.role === "admin";

  // ✅ Get admin dashboard stats
  const getDashboardStats = async () => {
    try {
      const data = await makeApiCall(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
      return { success: true, data };
    } catch (error) {
      console.error("Dashboard stats error:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Get admin orders
  const getAdminOrders = async (params = "") => {
    try {
      const data = await makeApiCall(`${API_ENDPOINTS.ADMIN.ORDERS}${params}`);
      return { success: true, data };
    } catch (error) {
      console.error("Fetch admin orders error:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Update user profile
  const updateProfile = async (userData) => {
    try {
      const updatedUser = await makeApiCall(API_ENDPOINTS.USERS.PROFILE, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
      setUser(updatedUser);
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Address Management
  const addAddress = async (addressData) => {
    try {
      const addresses = await makeApiCall(API_ENDPOINTS.USERS.ADDRESSES, {
        method: "POST",
        body: JSON.stringify(addressData),
      });
      setUser((prev) => ({ ...prev, addresses }));
      return { success: true, data: addresses };
    } catch (error) {
      console.error("Add address error:", error);
      return { success: false, error: error.message };
    }
  };

  const getAddresses = async () => {
    try {
      const addresses = await makeApiCall(API_ENDPOINTS.USERS.ADDRESSES);
      return { success: true, data: addresses };
    } catch (error) {
      console.error("Get addresses error:", error);
      return { success: false, error: error.message };
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const addresses = await makeApiCall(`${API_ENDPOINTS.USERS.ADDRESSES}/${addressId}`, {
        method: "PUT",
        body: JSON.stringify(addressData),
      });
      setUser((prev) => ({ ...prev, addresses }));
      return { success: true, data: addresses };
    } catch (error) {
      console.error("Update address error:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const addresses = await makeApiCall(`${API_ENDPOINTS.USERS.ADDRESSES}/${addressId}`, {
        method: "DELETE",
      });
      setUser((prev) => ({ ...prev, addresses }));
      return { success: true, data: addresses };
    } catch (error) {
      console.error("Delete address error:", error);
      return { success: false, error: error.message };
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const addresses = await makeApiCall(`${API_ENDPOINTS.USERS.ADDRESSES}/${addressId}`, {
        method: "PUT",
        body: JSON.stringify({ isDefault: true }),
      });
      setUser((prev) => ({ ...prev, addresses }));
      return { success: true, data: addresses };
    } catch (error) {
      console.error("Set default address error:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Provide everything in context
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
    getDashboardStats,
    getAdminOrders,
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
