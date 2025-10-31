import React, { useState, useEffect } from "react";
import { useCart } from '../context/CartContext';

const BestSellers = () => {
  const { addToCart } = useCart();
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Try multiple endpoints
        const endpoints = [
          'http://localhost:5000/api/products/category/bestseller',
          'http://localhost:5000/api/products/bestsellers',
          'http://localhost:5000/api/products'
        ];
        
        let products = [];
        
        for (let endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            const response = await fetch(endpoint);
            
            if (response.ok) {
              const data = await response.json();
              console.log(`Success from ${endpoint}:`, data);
              
              // Handle different response formats
              if (Array.isArray(data)) {
                products = data;
              } else if (data.products && Array.isArray(data.products)) {
                products = data.products;
              } else if (data.data && Array.isArray(data.data)) {
                products = data.data;
              }
              
              // If we got products, filter for bestsellers
              if (products.length > 0) {
                // Filter products that are bestsellers or have bestseller category
                const bestsellerProducts = products.filter(product => 
                  product.category === 'bestseller' || 
                  product.isBestSeller === true
                );
                
                // If we found bestsellers, use them
                if (bestsellerProducts.length > 0) {
                  setBestSellers(bestsellerProducts);
                  return; // Exit early if successful
                }
                
                // If no specific bestsellers but we have products, use first 8
                if (products.length > 0) {
                  setBestSellers(products.slice(0, 8));
                  return;
                }
              }
            }
          } catch (endpointError) {
            console.log(`Endpoint ${endpoint} failed:`, endpointError);
            // Continue to next endpoint
          }
        }
        
        // If all endpoints failed, use fallback data
        throw new Error('All API endpoints failed');
        
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
        setError('Failed to load bestsellers from server');
        // Use fallback data
        setBestSellers(getFallbackBestSellers());
      } finally {
        setLoading(false);
      }
    };
    
    fetchBestSellers();
  }, []);

  // Fallback data function
  const getFallbackBestSellers = () => {
    return [
      {
        _id: "1",
        name: "Chocolate Truffle Cake",
        description: "Rich chocolate cake with creamy truffle",
        price: 599,
        category: "bestseller",
        images: [{ url: "/images/chocotruffle.webp", alt: "Chocolate Cake" }],
        isEggless: true,
        stock: 10
      },
      {
        _id: "2",
        name: "Red Velvet Cake",
        description: "Classic red velvet with cream cheese",
        price: 699,
        category: "bestseller",
        images: [{ url: "/images/redvelvet.jpg", alt: "Red Velvet Cake" }],
        isEggless: false,
        stock: 8
      },
      {
        _id: "3",
        name: "French Croissant",
        description: "Buttery and flaky croissants",
        price: 120,
        category: "bestseller",
        images: [{ url: "/images/French-Croissant1.jpeg", alt: "Croissant" }],
        isEggless: false,
        stock: 20
      },
      {
        _id: "4",
        name: "Chocolate Donuts",
        description: "Soft donuts with chocolate glaze",
        price: 180,
        category: "bestseller",
        images: [{ url: "/images/choco-donuts.jpg", alt: "Chocolate Donuts" }],
        isEggless: true,
        stock: 15
      },
      {
        _id: "5",
        name: "Black Forest Cake",
        description: "Classic black forest with cherries",
        price: 799,
        category: "bestseller",
        images: [{ url: "/images/black-forest.jpeg", alt: "Black Forest Cake" }],
        isEggless: false,
        stock: 5
      },
      {
        _id: "6",
        name: "Pineapple Cake",
        description: "Fresh pineapple with cream",
        price: 649,
        category: "bestseller",
        images: [{ url: "/images/Pineapple-Cake.jpg", alt: "Pineapple Cake" }],
        isEggless: true,
        stock: 7
      },
      {
        _id: "7",
        name: "Cheese Garlic Bread",
        description: "Garlic bread with cheese topping",
        price: 199,
        category: "bestseller",
        images: [{ url: "/images/cheese-garlic-bread.jpg", alt: "Cheese Garlic Bread" }],
        isEggless: false,
        stock: 12
      },
      {
        _id: "8",
        name: "Chocolate Muffins",
        description: "Soft chocolate muffins",
        price: 240,
        category: "bestseller",
        images: [{ url: "/images/choco-muffins.jpg", alt: "Chocolate Muffins" }],
        isEggless: true,
        stock: 18
      }
    ];
  };

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
    addToCart({
      _id: product._id, // Make sure to include _id
      id: product._id, // Use _id as id as well for compatibility
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || product.image,
      quantity: 1
    });
    alert(`${product.name} added to cart! 🛒`);
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return product.image || '/images/placeholder-cake.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading delicious cakes...</p>
        </div>
      </div>
    );
  }

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

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>{error} - Showing sample products</p>
          </div>
        </div>
      )}

      {/* Best Selling Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.length > 0 ? (
              bestSellers.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-56 bg-gray-200 relative flex items-center justify-center overflow-hidden">
                    <img 
                      src={getImageUrl(product)} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-cake.jpg';
                      }}
                    />
                    <span className="absolute top-4 left-4 bg-red-700 text-white px-3 py-1 rounded-full text-sm">
                      Bestseller
                    </span>
                    {product.isEggless && (
                      <span className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                        Eggless
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-red-700">
                        ₹{product.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition duration-300 active:scale-95 transform ${
                          product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                    {product.stock > 0 && product.stock < 5 && (
                      <p className="text-orange-600 text-sm mt-2">
                        Only {product.stock} left!
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-xl text-gray-600">No bestseller products found.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-700 text-white px-6 py-2 rounded-full hover:bg-red-800 transition duration-300"
                >
                  Try Again
                </button>
              </div>
            )}
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