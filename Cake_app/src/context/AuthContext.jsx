import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with backend - CHANGED URL
          const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token is invalid
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function - CHANGED URL
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('token', userData.token);
        return { success: true, data: userData };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Register function - CHANGED URL
 const register = async ({ name, email, password, phone }) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone }),
    });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('token', userData.token);
        return { success: true, data: userData };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Update user profile - CHANGED URL
  const updateProfile = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        return { success: true, data: updatedUser };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Address Management Functions

  // Add new address - CHANGED URL
  const addAddress = async (addressData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        const addresses = await response.json();
        // Update user with new addresses
        setUser(prevUser => ({
          ...prevUser,
          addresses
        }));
        return { success: true, data: addresses };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Get user addresses - CHANGED URL
  const getAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const addresses = await response.json();
        return { success: true, data: addresses };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Update address - CHANGED URL
  const updateAddress = async (addressId, addressData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        const addresses = await response.json();
        // Update user with new addresses
        setUser(prevUser => ({
          ...prevUser,
          addresses
        }));
        return { success: true, data: addresses };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Delete address - CHANGED URL
  const deleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const addresses = await response.json();
        // Update user with new addresses
        setUser(prevUser => ({
          ...prevUser,
          addresses
        }));
        return { success: true, data: addresses };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Set default address - CHANGED URL
  const setDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (response.ok) {
        const addresses = await response.json();
        // Update user with new addresses
        setUser(prevUser => ({
          ...prevUser,
          addresses
        }));
        return { success: true, data: addresses };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    // Address functions
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context itself for direct use with useContext
export default AuthContext;