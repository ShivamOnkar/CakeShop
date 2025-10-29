import React, { useState } from "react";
import { useCart } from '../context/CartContext';

const BestSellers = () => {
  const { addToCart } = useCart();

  const bestSellers = [
    {
      id: 1,
      name: "Chocolate Truffle Cake",
      description: "Rich chocolate cake with creamy truffle",
      price: 599,
      image: "/images/product1.jpg",
    },
    {
      id: 2,
      name: "Red Velvet Cake",
      description: "Classic red velvet with cream cheese",
      price: 699,
      image: "/images/product2.jpg",
    },
    {
      id: 3,
      name: "French Croissant",
      description: "Buttery and flaky croissants",
      price: 120,
      image: "/images/product3.jpg",
    },
    {
      id: 4,
      name: "Chocolate Donuts",
      description: "Soft donuts with chocolate glaze",
      price: 180,
      image: "/images/product4.jpg",
    },
    {
      id: 5,
      name: "Black Forest Cake",
      description: "Classic black forest with cherries",
      price: 799,
      image: "/images/product5.jpg",
    },
    {
      id: 6,
      name: "Pineapple Cake",
      description: "Fresh pineapple with cream",
      price: 649,
      image: "/images/product6.jpg",
    },
    {
      id: 7,
      name: "Cheese Garlic Bread",
      description: "Garlic bread with cheese topping",
      price: 199,
      image: "/images/product7.jpg",
    },
    {
      id: 8,
      name: "Chocolate Muffins",
      description: "Soft chocolate muffins",
      price: 240,
      image: "/images/product8.jpg",
    },
  ];

  // Add reviews array
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      initial: "P",
      location: "Mumbai",
      rating: 5,
      comment: "The Chocolate Truffle Cake was absolutely divine! So rich and moist."
    },
    {
      id: 2,
      name: "Rahul Verma",
      initial: "R",
      location: "Delhi",
      rating: 4,
      comment: "Best Red Velvet cake I've ever had. Will definitely order again!"
    },
    {
      id: 3,
      name: "Anita Patel",
      initial: "A",
      location: "Bangalore",
      rating: 5,
      comment: "Fresh croissants delivered right to my door. Perfect for breakfast!"
    }
  ];

  // Add renderStars function
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${
            i <= rating ? 'text-yellow-500' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart! 🛒`);
  };

  return (
    <div className="font-sans">
      {/* Best Sellers Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Best Sellers</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Our most loved products by customers
          </p>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="h-56 bg-gray-200 bg-cover bg-center relative flex items-center justify-center"
                  style={{ backgroundImage: `url(${product.image})` }}
                >
                  <span className="absolute top-4 left-4 bg-red-700 text-white px-3 py-1 rounded-full text-sm">
                    Bestseller
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-700">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
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

      {/* Customer Reviews */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">"{review.comment}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {review.initial}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <p className="text-gray-500 text-sm">{review.location}</p>
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

export default BestSellers;