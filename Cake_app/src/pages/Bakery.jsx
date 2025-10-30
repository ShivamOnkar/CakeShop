import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const Bakery = () => {
  const { addToCart } = useCart();
  const [bakeryItems, setBakeryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBakeryItems = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch bakery items from your API
        const response = await fetch('http://localhost:5000/api/products/category/bakery');
        
        if (!response.ok) {
          throw new Error('Failed to fetch bakery items');
        }
        
        const data = await response.json();
        setBakeryItems(data);
        
      } catch (error) {
        console.error('Error fetching bakery items:', error);
        setError('Failed to load bakery items');
        // Fallback to sample data if API fails
        setBakeryItems(getFallbackBakeryItems());
      } finally {
        setLoading(false);
      }
    };
    
    fetchBakeryItems();
  }, []);

  // Fallback data in case API fails
  const getFallbackBakeryItems = () => {
    return [
      {
        _id: "1",
        name: "French Croissant",
        description: "Buttery and flaky French croissants",
        price: 120,
        category: "bakery",
        images: [{ url: "/images/French-Croissant1.jpeg", alt: "French Croissant" }],
        isEggless: false,
        stock: 25
      },
      {
        _id: "2",
        name: "Chocolate Donuts",
        description: "Soft donuts with rich chocolate glaze",
        price: 180,
        category: "bakery",
        images: [{ url: "/images/choco-donuts.jpg", alt: "Chocolate Donuts" }],
        isEggless: true,
        stock: 20
      },
      {
        _id: "3",
        name: "Cheese Garlic Bread",
        description: "Garlic bread with melted cheese topping",
        price: 199,
        category: "bakery",
        images: [{ url: "/images/cheese-garlic-bread.jpg", alt: "Cheese Garlic Bread" }],
        isEggless: false,
        stock: 18
      },
      {
        _id: "4",
        name: "Chocolate Muffins",
        description: "Soft and moist chocolate muffins",
        price: 240,
        category: "bakery",
        images: [{ url: "/images/choco-muffins.jpg", alt: "Chocolate Muffins" }],
        isEggless: true,
        stock: 30
      }
    ];
  };

  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id,
      id: product._id,
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
          <p className="mt-4 text-xl text-gray-600">Loading bakery items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {/* Bakery Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bakery Items</h1>
          <p className="text-xl max-w-2xl mx-auto">Fresh pastries, cookies, and baked goods daily</p>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>{error} - Showing available items</p>
          </div>
        </div>
      )}

      {/* Bakery Items from Database */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fresh Bakery Items</h2>
          
          {bakeryItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {bakeryItems.map(product => (
                <div 
                  key={product._id} 
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
                      <span className="text-2xl font-bold text-red-700">₹{product.price}</span>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">No bakery items found.</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-700 text-white px-6 py-2 rounded-full hover:bg-red-800 transition duration-300"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Additional Bakery Sections (Cookies & Pastries) */}
      {/* You can keep your existing cookie and pastry sections as fallback */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">More Bakery Delights</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-8">
              Explore our full range of cookies, pastries, and desserts
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Fresh Cookies</h3>
                <p className="text-gray-600 mb-4">
                  Buttery, crispy, and chewy cookies baked fresh daily
                </p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Butter Cookies</li>
                  <li>• Chocolate Chip Cookies</li>
                  <li>• Oatmeal Raisin Cookies</li>
                  <li>• Peanut Butter Cookies</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Pastries & Desserts</h3>
                <p className="text-gray-600 mb-4">
                  Delicious pastries and desserts for every occasion
                </p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Chocolate Pastries</li>
                  <li>• Fruit Pastries</li>
                  <li>• Cream Pastries</li>
                  <li>• Specialty Desserts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bakery;