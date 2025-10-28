import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// Simple components for auth pages (create these files later)
const Login = () => <div className="min-h-screen bg-gray-50 py-8"><div className="container mx-auto px-4"><h1>Login</h1></div></div>;
const Signup = () => <div className="min-h-screen bg-gray-50 py-8"><div className="container mx-auto px-4"><h1>Signup</h1></div></div>;
const ForgotPassword = () => <div className="min-h-screen bg-gray-50 py-8"><div className="container mx-auto px-4"><h1>Forgot Password</h1></div></div>;

function App() {
  return (
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;