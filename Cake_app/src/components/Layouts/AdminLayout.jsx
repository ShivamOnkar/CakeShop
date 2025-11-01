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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-slate-800 text-white flex flex-col justify-between transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <h2 className="font-bold text-lg">
            {collapsed ? "CA" : "CAKE ADMIN"}
          </h2>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-300 hover:text-white text-lg"
          >
            <FaBars />
          </button>
        </div>

        {/* Menu Items */}
        <ul className="flex-1 mt-4">
          {menuItems.map((item) => (
            <li
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors
                ${
                  location.pathname === item.path
                    ? "bg-blue-600"
                    : "hover:bg-slate-700"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 bg-red-600 hover:bg-red-700 cursor-pointer transition-colors"
        >
          <FaSignOutAlt className="text-lg" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[85vh]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
