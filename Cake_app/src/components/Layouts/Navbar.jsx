import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { getCartItemsCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const cartItemsCount = getCartItemsCount();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  const openLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const closeLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center py-4">
          
          {/* Left (Search Icon) - Desktop */}
          <div className="hidden lg:flex items-center">
            <button 
              className="text-xl text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-50"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          {/* Center (Menu + Logo) - Desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl">
            <ul className="flex items-center space-x-4 xl:space-x-6 text-sm font-medium">
              <li><Link to="/" className="hover:text-red-600 transition duration-300 px-2 py-1 rounded whitespace-nowrap">Home</Link></li>
              <li><Link to="/birthday" className="hover:text-red-600 transition duration-300 px-2 py-1 rounded whitespace-nowrap">Birthday</Link></li>
              <li><Link to="/occasions" className="hover:text-red-600 transition duration-300 px-2 py-1 rounded whitespace-nowrap">Occasions</Link></li>
              <li className="text-xl xl:text-2xl font-bold text-amber-700 px-2 xl:px-4 whitespace-nowrap">Nandini's Cakes</li>
              <li><Link to="/best-sellers" className="hover:text-red-600 transition duration-300 px-2 py-1 rounded whitespace-nowrap">Best Sellers</Link></li>
              <li><Link to="/bakery" className="hover:text-red-600 transition duration-300 px-2 py-1 rounded whitespace-nowrap">Bakery</Link></li>
              <li><Link to="/chocolates" className="hover:text-red-600 transition duration-300 px-2 py-1 rounded whitespace-nowrap">Chocolate</Link></li>
            </ul>
          </div>

          {/* Mobile Logo - Center */}
          <div className="lg:hidden text-xl font-bold text-amber-700">
            Nandini's Cakes
          </div>

          {/* Right (Auth + Cart) - Desktop */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {/* Show Login/Register when NOT authenticated */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-red-600 transition duration-300 font-medium text-sm px-3 py-2 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-red-600 text-white px-3 py-2 rounded-full hover:bg-red-700 transition duration-300 font-medium text-sm shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            ) : (
              /* Show Account Icon when authenticated */
              <div className="flex items-center space-x-2 xl:space-x-3">
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-red-600 transition duration-300 relative group flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-50"
                    title="My Account"
                  >
                    <div className="w-7 h-7 xl:w-8 xl:h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <i className="fa-regular fa-user text-red-600 text-xs xl:text-sm"></i>
                    </div>
                    <span className="text-sm font-medium hidden xl:block whitespace-nowrap">
                      Hi, {user?.name?.split(' ')[0] || 'User'}
                    </span>
                  </Link>
                </div>
                <button 
                  onClick={openLogoutConfirm}
                  className="text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-50"
                  title="Logout"
                >
                  <i className="fa-solid fa-right-from-bracket text-lg"></i>
                </button>
              </div>
            )}

            {/* Cart Icon with count */}
            <Link 
              to="/cart" 
              className="text-gray-700 hover:text-red-600 transition duration-300 relative p-2 rounded-lg hover:bg-gray-50 group"
            >
              <i className="fa-solid fa-bag-shopping text-lg"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Cart Icon */}
            <Link 
              to="/cart" 
              className="text-gray-700 hover:text-red-600 transition duration-300 relative p-2"
            >
              <i className="fa-solid fa-bag-shopping text-lg"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center font-semibold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="text-gray-700 hover:text-red-600 transition duration-300 p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-3 px-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search cakes, pastries, cookies..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
        <div className="p-4 sm:p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div className="text-xl sm:text-2xl font-bold text-amber-700">
              Nandini's Cakes
            </div>
            <button 
              className="text-2xl sm:text-3xl text-gray-700 hover:text-red-600 transition duration-300 p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              &times;
            </button>
          </div>
          
          {/* User Info Section */}
          {isAuthenticated && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center text-white">
                  <i className="fa-regular fa-user text-sm sm:text-base"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{user?.name}</p>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 space-y-0 overflow-y-auto">
            {[
              { to: "/", icon: "fa-house", label: "Home" },
              { to: "/birthday", icon: "fa-cake-candles", label: "Birthday" },
              { to: "/occasions", icon: "fa-champagne-glasses", label: "Occasions" },
              { to: "/best-sellers", icon: "fa-star", label: "Best Sellers" },
              { to: "/bakery", icon: "fa-bread-slice", label: "Bakery" },
              { to: "/chocolates", icon: "fa-cookie", label: "Chocolate" },
              { to: "/about", icon: "fa-circle-info", label: "About Us" },
              { to: "/contact", icon: "fa-phone", label: "Contact Us" }
            ].map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className="flex items-center py-3 sm:py-4 text-base sm:text-lg text-gray-700 hover:text-red-600 border-b border-gray-200 transition duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className={`fa-solid ${item.icon} mr-3 w-6 text-center text-gray-400 group-hover:text-red-600`}></i>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Links */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center py-3 text-base sm:text-lg text-gray-700 hover:text-red-600 transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-regular fa-user mr-3 w-6 text-center"></i>
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center py-3 text-base sm:text-lg text-gray-700 hover:text-red-600 transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-user-plus mr-3 w-6 text-center"></i>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center py-3 text-base sm:text-lg text-gray-700 hover:text-red-600 transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-regular fa-user mr-3 w-6 text-center"></i>
                  My Account
                </Link>
                <button 
                  onClick={openLogoutConfirm}
                  className="flex items-center py-3 text-base sm:text-lg text-gray-700 hover:text-red-600 transition duration-300 w-full text-left"
                >
                  <i className="fa-solid fa-right-from-bracket mr-3 w-6 text-center"></i>
                  Logout
                </button>
              </>
            )}
            <Link 
              to="/cart" 
              className="flex items-center py-3 text-base sm:text-lg text-gray-700 hover:text-red-600 transition duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-bag-shopping mr-3 w-6 text-center"></i>
              Cart ({cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'})
            </Link>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 transform transition-all duration-300 scale-100">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-right-from-bracket text-red-600 text-2xl"></i>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">Logout Confirmation</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout from your account?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeLogoutConfirm}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay when mobile menu or search is open */}
      {(mobileMenuOpen || searchOpen) && (
        <div 
          className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
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