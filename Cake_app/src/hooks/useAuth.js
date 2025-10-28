import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const signup = async (userData) => {
    const { name, email, password } = userData;
    
    // Check if user already exists
    if (localStorage.getItem(email)) {
      throw new Error('Account already exists! Please login.');
    }

    const user = {
      id: Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(email, JSON.stringify(user));
    return user;
  };

  const login = async (email, password) => {
    const userData = localStorage.getItem(email);
    if (!userData) {
      throw new Error('No account found with this email!');
    }

    const user = JSON.parse(userData);
    if (user.password !== password) {
      throw new Error('Incorrect password. Please try again!');
    }

    sessionStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const resetPassword = async (email, newPassword) => {
    const userData = localStorage.getItem(email);
    if (!userData) {
      throw new Error('No account found with this email!');
    }

    const user = JSON.parse(userData);
    user.password = newPassword;
    user.updatedAt = new Date().toISOString();
    
    localStorage.setItem(email, JSON.stringify(user));
    return user;
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    validateEmail,
    validatePassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};