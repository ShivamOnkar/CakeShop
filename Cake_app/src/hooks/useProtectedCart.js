// src/hooks/useProtectedCart.js
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from './useNotification';

export const useProtectedCart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  const protectedAddToCart = useCallback(async (product, quantity = 1) => {
    if (!user) {
      showNotification('Please login to add items to cart', 'warning');
      navigate('/login', {
        state: {
          from: window.location.pathname,
          message: 'Please login to add items to your cart'
        }
      });
      throw new Error('Authentication required');
    }

    return await addToCart(product, quantity);
  }, [user, addToCart, navigate, showNotification]);

  return {
    protectedAddToCart
  };
};