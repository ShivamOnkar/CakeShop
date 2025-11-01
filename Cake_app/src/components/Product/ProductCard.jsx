// src/components/Product/ProductCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../hooks/useNotification';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      showNotification('Please login to add items to cart', 'warning');
      navigate('/login', {
        state: {
          from: window.location.pathname,
          message: 'Please login to add items to your cart'
        }
      });
      return;
    }

    try {
      setIsAdding(true);
      await addToCart(product, 1);
    } catch (error) {
      // Error is already handled in CartContext
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      showNotification('Please login to proceed', 'warning');
      navigate('/login', {
        state: {
          from: '/checkout',
          message: 'Please login to proceed with your order'
        }
      });
      return;
    }

    // Add to cart and navigate to checkout
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-bold text-red-700">₹{product.price}</span>
          <span className="text-gray-500 line-through text-sm">₹{product.price + 50}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition ${
              isAdding ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;