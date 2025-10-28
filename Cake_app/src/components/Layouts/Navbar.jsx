import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-red-800 text-white py-2">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex space-x-6 text-lg">
            <Link to="/about" className="hover:text-yellow-300 font-medium">About</Link>
            <Link to="/contact" className="hover:text-yellow-300 font-medium">Contact</Link>
          </div>
          <div className="flex space-x-4 text-2xl">
            <a href="https://www.instagram.com/nandinicake_cookies" className="hover:text-yellow-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://m.facebook.com/114489843677281/" className="hover:text-yellow-300">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">NC</span>
              </div>
              <span className="text-2xl font-bold text-red-700">Nandini Cakes</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-red-700 font-medium">Home</Link>
              <Link to="/birthday" className="text-gray-700 hover:text-red-700 font-medium">Birthday</Link>
              <Link to="/occasions" className="text-gray-700 hover:text-red-700 font-medium">Occasions</Link>
              <Link to="/best-sellers" className="text-gray-700 hover:text-red-700 font-medium">Best Sellers</Link>
              <Link to="/bakery" className="text-gray-700 hover:text-red-700 font-medium">Bakery</Link>
              <Link to="/chocolates" className="text-gray-700 hover:text-red-700 font-medium">Chocolates</Link>
            </div>

            {/* Right Icons */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/login" className="text-gray-700 hover:text-red-700">
                <i className="fas fa-user text-xl"></i>
              </Link>
              <button className="text-gray-700 hover:text-red-700 relative">
                <i className="fas fa-shopping-cart text-xl"></i>
                <span className="absolute -top-2 -right-2 bg-red-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">0</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-gray-700 text-2xl"
              onClick={() => setMobileMenuOpen(true)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">NC</span>
              </div>
              <span className="text-xl font-bold text-red-700">Nandini Cakes</span>
            </div>
            <button 
              className="text-3xl text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              &times;
            </button>
          </div>
          <nav className="space-y-4">
            <Link to="/" className="block py-2 text-lg text-gray-700 hover:text-red-700" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/birthday" className="block py-2 text-lg text-gray-700 hover:text-red-700" onClick={() => setMobileMenuOpen(false)}>Birthday</Link>
            <Link to="/occasions" className="block py-2 text-lg text-gray-700 hover:text-red-700" onClick={() => setMobileMenuOpen(false)}>Occasions</Link>
            <Link to="/best-sellers" className="block py-2 text-lg text-gray-700 hover:text-red-700" onClick={() => setMobileMenuOpen(false)}>Best Sellers</Link>
            <Link to="/bakery" className="block py-2 text-lg text-gray-700 hover:text-red-700" onClick={() => setMobileMenuOpen(false)}>Bakery</Link>
            <Link to="/chocolates" className="block py-2 text-lg text-gray-700 hover:text-red-700" onClick={() => setMobileMenuOpen(false)}>Chocolates</Link>
            <Link to="/about" className="block py-2 text-lg text-gray-700 hover:text-red-700" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link to="/contact" className="block py-2 text-lg text-gray-700 hover:text-red-700" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/login" className="block py-2 text-lg text-gray-700 hover:text-red-700" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;