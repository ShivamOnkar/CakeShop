import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Bakery = () => {
  const { addToCart } = useCart();

  const cookies = [
    {
      id: 1,
      name: 'Butter Cookie',
      image: '/images/buttercooki.jpg',
      description: 'Delicate, buttery, and melt-in-your-mouth soft.',
      price: 150
    },
    {
      id: 2,
      name: 'Choco-chip Cookie',
      image: '/images/chocochipcooki.webp',
      description: 'Crispy edges, gooey center – the all-time favorite cookie!',
      price: 180
    },
    {
      id: 3,
      name: 'Oatmeal Raisin Cookies',
      image: '/images/oatmealcooki.webp',
      description: 'Chewy, hearty, and filled with the goodness of oats & raisins.',
      price: 180
    },
    {
      id: 4,
      name: 'Peanut Butter Cookies',
      image: '/images/peanutcooki.jpg',
      description: 'Nutty, rich, and melt-in-your-mouth goodness.',
      price: 180
    }
  ];

  const pastries = [
    {
      id: 1,
      name: 'Chocolate Pastry',
      image: '/images/chocopastry.jpg',
      description: 'Rich chocolate pastry',
      price: 60
    },
    {
      id: 2,
      name: 'Black Forest Pastry',
      image: '/images/blackpastry.jpg',
      description: 'Classic black forest flavor',
      price: 70
    },
    {
      id: 3,
      name: 'Strawberry Pastry',
      image: '/images/strawberrypastry.jpg',
      description: 'Fresh strawberry pastry',
      price: 65
    },
    {
      id: 4,
      name: 'Vanilla Pastry',
      image: '/images/vanilapastry.jpg',
      description: 'Classic vanilla flavor',
      price: 55
    }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart! 🛒`);
  };

  return (
    <div>
      {/* Bakery Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bakery Items</h1>
          <p className="text-xl max-w-2xl mx-auto">Fresh Cupcakes, pastries, and baked goods daily</p>
        </div>
      </section>

      {/* Cookies Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fresh Cookies</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cookies.map(cookie => (
              <div key={cookie.id} className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div 
                  className="h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${cookie.image})` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{cookie.name}</h3>
                  <p className="text-gray-600 mb-4">{cookie.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-700">₹{cookie.price}</span>
                    <button 
                      onClick={() => handleAddToCart(cookie)} {/* Fixed: use cookie instead of product */}
                      className="add-to-cart bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition duration-300 active:scale-95 transform"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pastries Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pastries & Desserts</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pastries.map(pastry => (
              <div key={pastry.id} className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div 
                  className="h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${pastry.image})` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{pastry.name}</h3>
                  <p className="text-gray-600 mb-4">{pastry.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-700">₹{pastry.price}</span>
                    <button 
                      onClick={() => handleAddToCart(pastry)} {/* Fixed: use pastry instead of product */}
                      className="add-to-cart bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition duration-300 active:scale-95 transform"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bakery;