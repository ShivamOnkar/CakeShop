import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext'; // Add this import

const Login = () => {
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showNotification } = useNotification(); // Add this
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.loginEmail, formData.loginPassword);
      
      if (result.success) {
        showNotification('Login successful!', 'success');
        navigate(from, { replace: true });
      } else {
        // Show error without redirecting
        setError(result.error || 'Login failed. Please try again.');
        showNotification(result.error || 'Login failed', 'error');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      showNotification(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log('Google login attempt');
    setError('Google login not implemented yet');
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side */}
        <div className="w-full md:w-1/2 bg-red-100 p-8 md:p-10 flex flex-col justify-between">
          <div className="flex justify-center">
            <img 
              src="/images/online-shopping.webp" 
              alt="Online Shopping Illustration" 
              className="w-58 lg:w-74 animate-float"
            />
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fas fa-shopping-cart text-red-600"></i>
              </div>
              <span className="text-gray-700 font-medium">Instant Checkout</span>
            </div>
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-box text-purple-600"></i>
              </div>
              <span className="text-gray-700 font-medium">Manage Your Orders</span>
            </div>
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fas fa-gift text-yellow-600"></i>
              </div>
              <span className="text-gray-700 font-medium">Exclusive Offers</span>
            </div>
          </div>
        </div>

        {/* Right Side (Login Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <h2 className="text-2xl font-semibold mb-6">Login</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form id="loginForm" className="space-y-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              id="loginEmail" 
              placeholder="Email ID / Mobile Number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300" 
              required
              value={formData.loginEmail}
              onChange={handleChange}
              disabled={loading}
            />
            <input 
              type="password" 
              id="loginPassword" 
              placeholder="Password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300" 
              required
              value={formData.loginPassword}
              onChange={handleChange}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'LOGGING IN...' : 'CONTINUE'}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-2">
            By continuing, you agree to Nandini Cakes{' '}
            <a href="#" className="text-blue-500 hover:underline">Terms of Use</a> and{' '}
            <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
          </p>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">Or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 flex items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition duration-300 mb-4"
            disabled={loading}
          >
            <i className="fab fa-google text-red-500 mr-2"></i> 
            Login with Google
          </button>

          <div className="text-center">
            <Link to="/forgot-password" className="text-red-600 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>

          <p className="text-center text-gray-700 mt-4 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-red-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Demo:</strong> Use any email and password to test login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;