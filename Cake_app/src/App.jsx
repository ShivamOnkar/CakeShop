import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layouts/Navbar';
import Footer from './components/Layouts/Footer';
import Home from './pages/Home';
import BestSellers from './pages/BestSellers';
import Bakery from './pages/Bakery';
import Birthday from './pages/Birthday';
import Occasions from './pages/Occasions';
import Chocolates from './pages/Chocolates';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ProtectedRoute from './components/Common/ProtectedRoute';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
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
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;