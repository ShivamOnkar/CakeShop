import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import Birthday from './pages/Birthday';
import Occasions from './pages/Occasions';
import BestSellers from './pages/BestSellers';
import Bakery from './pages/Bakery';
import Chocolates from './pages/Chocolates';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Layouts/Navbar';
import Footer from './components/Layouts/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App font-sans">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/birthday" element={<Birthday />} />
              <Route path="/occasions" element={<Occasions />} />
              <Route path="/best-sellers" element={<BestSellers />} />
              <Route path="/bakery" element={<Bakery />} />
              <Route path="/chocolates" element={<Chocolates />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;