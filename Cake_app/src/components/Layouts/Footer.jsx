import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">NC</span>
              </div>
              <span className="text-2xl font-bold">Nandini Cakes</span>
            </div>
            <p className="text-gray-400 mb-4">Fresh bakery products since 2020. Your trusted bakery in Amravati.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/best-sellers" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/birthday" className="text-gray-400 hover:text-white">Birthday Cakes</Link></li>
              <li><Link to="/occasions" className="text-gray-400 hover:text-white">Occasion Cakes</Link></li>
              <li><Link to="/bakery" className="text-gray-400 hover:text-white">Bakery Items</Link></li>
              <li><Link to="/chocolates" className="text-gray-400 hover:text-white">Chocolates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-3 text-red-600"></i>
                <span>New Prabhat Colony, Shankar Nagar Road, Amravati, Maharashtra</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-red-600"></i>
                <span>+91 8550989777</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3 text-red-600"></i>
                <span>Open: 11:00 AM - 12:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2020 Nandini Cakes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;