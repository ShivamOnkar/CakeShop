// Auth utility functions
export const AuthUtils = {
  // Validate email format
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword: (password) => {
    return password.length >= 6;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return sessionStorage.getItem('currentUser') !== null;
  },

  // Get current user
  getCurrentUser: () => {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  // Logout user
  logout: () => {
    sessionStorage.removeItem('currentUser');
    window.location.href = '/login';
  }
};