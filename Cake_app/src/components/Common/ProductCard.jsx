import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useNotification } from '../../hooks/useNotification';

const ProductCard = ({ product, showBestseller = false, showCategory = false }) => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Add bounce animation
    const button = e.target;
    button.classList.add('bounce');
    setTimeout(() => {
      button.classList.remove('bounce');
    }, 1000);
  };

  const handleImageClick = () => {
    if (product.image) {
      window.open(product.image, '_blank');
    }
  };

  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      <div 
        className="h-56 bg-cover bg-center relative cursor-pointer"
        style={{ backgroundImage: `url(${product.image})` }}
        onClick={handleImageClick}
      >
        {showBestseller && (
          <span className="absolute top-4 left-4 bg-red-700 text-white px-3 py-1 rounded-full text-sm">
            Bestseller
          </span>
        )}
        {showCategory && product.category && (
          <span className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
            {product.category}
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-red-700">₹{product.price}</span>
          <button 
            onClick={handleAddToCart}
            className="add-to-cart bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;