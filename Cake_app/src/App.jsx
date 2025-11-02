import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Navbar from "./components/Layouts/Navbar";
import Footer from "./components/Layouts/Footer";
import Home from "./pages/Home";
import BestSellers from "./pages/BestSellers";
import Bakery from "./pages/Bakery";
import Birthday from "./pages/Birthday";
import Occasions from "./pages/Occasions";
import Chocolates from "./pages/Chocolates";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin pages
import Dashboard from "./pages/Admin/Dashboard";
import Products from "./pages/Admin/Products";
import Orders from "./pages/Admin/Orders";
import Users from "./pages/Admin/Users";
import AdminLogin from "./pages/Admin/AdminLogin";
// import AdminAddProduct from "./pages/Admin/AdminAddProduct"; // ✅ NEW IMPORT

// Layout wrapper to hide Navbar/Footer on admin routes
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <div className="App">
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/best-sellers" element={<BestSellers />} />
                  <Route path="/bakery" element={<Bakery />} />
                  <Route path="/birthday" element={<Birthday />} />
                  <Route path="/occasions" element={<Occasions />} />
                  <Route path="/chocolates" element={<Chocolates />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Admin Login */}
                  <Route path="/admin-login" element={<AdminLogin />} />

                  {/* Protected User Route */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <Products />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <Users />
                      </ProtectedRoute>
                    }
                  />
                  {/* ✅ NEW ROUTE FOR ADD PRODUCT
                  <Route
                    path="/admin/add-product"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminAddProduct />
                      </ProtectedRoute>
                    }
                  /> */}

                  {/* 404 Page */}
                  <Route
                    path="*"
                    element={
                      <div
                        style={{
                          textAlign: "center",
                          padding: "100px 20px",
                          minHeight: "60vh",
                        }}
                      >
                        <h1>404 - Page Not Found</h1>
                        <p>The page you're looking for doesn't exist.</p>
                      </div>
                    }
                  />
                </Routes>
              </Layout>
            </div>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
