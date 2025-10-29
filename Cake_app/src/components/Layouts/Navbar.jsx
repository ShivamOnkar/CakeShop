import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();

  return (
    <>
      {/* TOP NAVBAR */}
      <div className="w-full border-b border-gray-200 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-2 text-sm">
          
          {/* Left: About & Contact */}
          <div className="flex space-x-6">
            <Link to="/about" className="hover:text-red-600 transition duration-300">About Us</Link>
            <Link to="/contact" className="hover:text-red-600 transition duration-300">Contact Us</Link>
          </div>
          
          {/* Right: Social + Food Logos */}
          <div className="flex space-x-4 text-lg items-center">
            <a href="https://www.instagram.com/nandinicake_cookies" className="hover:text-red-600 transition duration-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://m.facebook.com/114489843677281/" className="hover:text-red-600 transition duration-300">
              <i className="fab fa-facebook-f"></i>
            </a>

            {/* Food Delivery Logos */}
            <a href="https://www.swiggy.com/city/amravati/nandini-cake-shop-sai-nagar-rest461393" className="hover:opacity-80 transition duration-300">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xs">S</span>
              </div>
            </a>

            <a href="https://www.justdial.com/Amravati/Nandinis-Cake-Delivery-Service-Near-Shiv-Mandir-Nawathe/9999PX721-X721-191104134806-N7M8_BZDET" className="hover:opacity-80 transition duration-300">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xs">JD</span>
              </div>
            </a>

            <a href="https://www.zomato.com/amravati/nandini-cake-shop-sai-nagar/order" className="hover:opacity-80 transition duration-300">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">Z</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="w-full bg-white text-gray-800 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center py-4 relative">
          
          {/* Left (Search Icon) - Desktop */}
          <div className="absolute left-6 hidden lg:flex items-center space-x-6">
            <button 
              className="text-xl text-gray-700 hover:text-red-600 transition duration-300 relative group"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          {/* Center (Menu + Logo) - Desktop */}
          <ul className="hidden lg:flex justify-center items-center space-x-8 text-md font-medium">
            <li><Link to="/" className="hover:text-red-600 transition duration-300">Home</Link></li>
            <li><Link to="/birthday" className="hover:text-red-600 transition duration-300">Birthday</Link></li>
            <li><Link to="/occasions" className="hover:text-red-600 transition duration-300">Occasions</Link></li>
            <li className="text-3xl font-bold text-amber-700 px-4">Nandini's Cakes</li>
            <li><Link to="/best-sellers" className="hover:text-red-600 transition duration-300">Best Sellers</Link></li>
            <li><Link to="/bakery" className="hover:text-red-600 transition duration-300">Bakery</Link></li>
            <li><Link to="/chocolates" className="hover:text-red-600 transition duration-300">Chocolate</Link></li>
          </ul>

          {/* Mobile Logo - Center */}
          <div className="lg:hidden text-2xl font-bold text-amber-700">
            Nandini's Cakes
          </div>

          {/* Right (Login + Cart) - Desktop */}
          <div className="absolute right-6 hidden lg:flex items-center space-x-6 text-xl">
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-red-600 transition duration-300 relative group"
            >
              <i className="fa-regular fa-user"></i>
            </Link>

            {/* Cart Icon with count */}
            <Link 
              to="/cart" 
              className="text-gray-700 hover:text-red-600 transition duration-300 relative group"
            >
              <i className="fa-solid fa-bag-shopping"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden absolute right-6 flex items-center space-x-4">
            {/* Mobile Cart Icon */}
            <Link 
              to="/cart" 
              className="text-gray-700 hover:text-red-600 transition duration-300 relative"
            >
              <i className="fa-solid fa-bag-shopping text-lg"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="text-gray-700 hover:text-red-600 transition duration-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-3 px-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search cakes, pastries, cookies..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />
              <button 
                className="absolute right-4 top-3 text-gray-500 hover:text-red-600"
                onClick={() => setSearchOpen(false)}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-2xl font-bold text-amber-700">
              Nandini's Cakes
            </div>
            <button 
              className="text-3xl text-gray-700 hover:text-red-600 transition duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              &times;
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 space-y-0 overflow-y-auto">
            <Link to="/" className="block py-4 text-lg text-gray-700 hover:text-red-600 border-b border-gray-200 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-house mr-3 w-6 text-center"></i>
              Home
            </Link>
            <Link to="/birthday" className="block py-4 text-lg text-gray-700 hover:text-red-600 border-b border-gray-200 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-cake-candles mr-3 w-6 text-center"></i>
              Birthday
            </Link>
            <Link to="/occasions" className="block py-4 text-lg text-gray-700 hover:text-red-600 border-b border-gray-200 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-champagne-glasses mr-3 w-6 text-center"></i>
              Occasions
            </Link>
            <Link to="/best-sellers" className="block py-4 text-lg text-gray-700 hover:text-red-600 border-b border-gray-200 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-star mr-3 w-6 text-center"></i>
              Best Sellers
            </Link>
            <Link to="/bakery" className="block py-4 text-lg text-gray-700 hover:text-red-600 border-b border-gray-200 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-bread-slice mr-3 w-6 text-center"></i>
              Bakery
            </Link>
            <Link to="/chocolates" className="block py-4 text-lg text-gray-700 hover:text-red-600 border-b border-gray-200 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-cookie mr-3 w-6 text-center"></i>
              Chocolate
            </Link>
            <Link to="/about" className="block py-4 text-lg text-gray-700 hover:text-red-600 border-b border-gray-200 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-circle-info mr-3 w-6 text-center"></i>
              About Us
            </Link>
            <Link to="/contact" className="block py-4 text-lg text-gray-700 hover:text-red-600 border-b border-gray-200 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-phone mr-3 w-6 text-center"></i>
              Contact Us
            </Link>
          </nav>

          {/* Mobile Auth Links */}
          <div className="pt-6 border-t border-gray-200">
            <Link to="/login" className="flex items-center py-3 text-lg text-gray-700 hover:text-red-600 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-regular fa-user mr-3 w-6 text-center"></i>
              Login / Register
            </Link>
            <Link to="/cart" className="flex items-center py-3 text-lg text-gray-700 hover:text-red-600 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-bag-shopping mr-3 w-6 text-center"></i>
              Cart ({cartItemsCount} items)
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay when mobile menu or search is open */}
      {(mobileMenuOpen || searchOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {
            setMobileMenuOpen(false);
            setSearchOpen(false);
          }}
        ></div>
      )}
    </>
  );
};

export default Navbar;