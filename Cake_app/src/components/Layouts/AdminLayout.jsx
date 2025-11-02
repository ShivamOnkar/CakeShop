import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/products", label: "Products", icon: <FaBoxOpen /> },
    { path: "/admin/orders", label: "Orders", icon: <FaShoppingCart /> },
    { path: "/admin/users", label: "Users", icon: <FaUsers /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-slate-800 text-white flex flex-col justify-between transition-all duration-300 shadow-lg`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <h2
            className={`font-bold text-lg tracking-wide transition-all ${
              collapsed ? "text-center w-full" : ""
            }`}
          >
            {collapsed ? "CA" : "🎂 CAKE ADMIN"}
          </h2>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-300 hover:text-white text-lg ml-2"
            title={collapsed ? "Expand Menu" : "Collapse Menu"}
          >
            <FaBars />
          </button>
        </div>

        {/* Navigation Menu */}
        <ul className="flex-1 mt-6">
          {menuItems.map((item) => (
            <li
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-all duration-200 rounded-md mx-2 my-1
                ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-slate-700 text-gray-300"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && (
                <span className="text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Logout Section */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 bg-red-600 hover:bg-red-700 cursor-pointer transition-all duration-200"
        >
          <FaSignOutAlt className="text-lg" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-white shadow-md px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {location.pathname === "/admin"
              ? "Dashboard Overview"
              : location.pathname.includes("products")
              ? "Manage Products"
              : location.pathname.includes("orders")
              ? "Orders Management"
              : location.pathname.includes("users")
              ? "User Management"
              : "Admin Panel"}
          </h1>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <div className="bg-white p-6 rounded-xl shadow-md min-h-[80vh] border border-gray-200">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
