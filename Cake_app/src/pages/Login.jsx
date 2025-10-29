import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log('Google login attempt');
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side */}
        <div className="w-full md:w-1/2 bg-pink-100 p-8 md:p-10 flex flex-col justify-between">
          <div className="flex justify-center">
            <img 
              src="https://cdn.pixabay.com/photo/2018/05/01/13/04/cake-3364301_1280.png" 
              alt="Cake Illustration" 
              className="w-48 md:w-64 animate-float"
            />
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <i className="fas fa-shopping-cart text-pink-600"></i>
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

          <form id="loginForm" className="space-y-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              id="loginEmail" 
              placeholder="Email ID / Mobile Number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-300" 
              required
              value={formData.loginEmail}
              onChange={handleChange}
            />
            <input 
              type="password" 
              id="loginPassword" 
              placeholder="Password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-300" 
              required
              value={formData.loginPassword}
              onChange={handleChange}
            />
            <button 
              type="submit" 
              className="w-full bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition duration-300 transform hover:scale-105"
            >
              CONTINUE
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
          >
            <i className="fab fa-google text-red-500 mr-2"></i> 
            Login with Google
          </button>

          <div className="text-center">
            <Link to="/forgot-password" className="text-pink-600 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>

          <p className="text-center text-gray-700 mt-4 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-pink-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;