// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, isAuthenticated, logout } = useAuth(); // Add logout to destructuring
  const { showNotification } = useNotification();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Clear cart when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      // If user is not authenticated, clear the cart
      setCart([]);
      localStorage.removeItem('cart');
    }
  }, [isAuthenticated]);

  const addToCart = (product, quantity = 1) => {
    // Check if user is logged in
    if (!user) {
      showNotification('Please login to add items to cart', 'warning');
      throw new Error('User must be logged in to add to cart');
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        showNotification(`Updated ${product.name} quantity in cart!`, 'success');
        return updatedCart;
      } else {
        // Add new item to cart
        const newItem = {
          id: product.id || product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity
        };
        showNotification(`${product.name} added to cart!`, 'success');
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== productId);
      if (updatedCart.length === 0) {
        localStorage.removeItem('cart');
      }
      return updatedCart;
    });
    showNotification('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    showNotification('Cart cleared', 'info');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;