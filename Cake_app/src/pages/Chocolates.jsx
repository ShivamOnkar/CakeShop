import React, { useState, useEffect } from "react";
import { useCart } from '../context/CartContext';
import { useNotification } from '../hooks/useNotification';

const Chocolates = () => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [chocolates, setChocolates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChocolates = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('http://localhost:5000/api/products/category/chocolate');
        
        if (!response.ok) {
          throw new Error('Failed to fetch chocolates');
        }
        
        const data = await response.json();
        
        // Check if the response has the expected structure
        if (data.success && data.products) {
          setChocolates(data.products);
        } else if (Array.isArray(data)) {
          // If the API returns direct array (without success wrapper)
          setChocolates(data);
        } else {
          throw new Error(data.message || 'Failed to load chocolates');
        }
        
      } catch (error) {
        console.error('Error fetching chocolates:', error);
        setError('Failed to load chocolates from server');
        setChocolates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChocolates();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id,
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || product.image,
      quantity: 1
    });
    showNotification(`${product.name} added to cart! 🛒`, 'success');
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
          <p className="mt-4 text-xl text-gray-600">Loading chocolates...</p>
        </div>
      </div>
    );
  }

  if (error && chocolates.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-700 text-white px-6 py-2 rounded-full hover:bg-red-800 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Chocolates Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chocolates</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Premium quality chocolates and desserts
          </p>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Chocolate Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {chocolates.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {chocolates.map((chocolate) => (
                <div
                  key={chocolate._id || chocolate.id}
                  className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                >
                  <div className="h-56 bg-gray-200 relative flex items-center justify-center overflow-hidden">
                    <img 
                      src={getImageUrl(chocolate)} 
                      alt={chocolate.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-cake.jpg';
                      }}
                    />
                    {chocolate.isEggless && (
                      <span className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                        Eggless
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{chocolate.name}</h3>
                    <p className="text-gray-600 mb-4">{chocolate.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-red-700">
                        ₹{chocolate.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(chocolate)}
                        disabled={chocolate.stock === 0}
                        className={`bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition duration-300 active:scale-95 transform ${
                          chocolate.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {chocolate.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                    {chocolate.stock > 0 && chocolate.stock < 5 && (
                      <p className="text-orange-600 text-sm mt-2">
                        Only {chocolate.stock} left!
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">No chocolates found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Chocolate Gifts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Chocolate Gift Boxes
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/chocogiftbox.jpg"
                alt="Chocolate Gift Box"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Perfect Gift for Every Occasion
              </h3>
              <p className="text-gray-600 mb-6">
                Our premium chocolate gift boxes are perfect for birthdays,
                anniversaries, festivals, or just to show someone you care. Each
                box is carefully curated with our finest chocolates.
              </p>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-center">
                  <span className="text-red-700 mr-2">✓</span> Customizable gift
                  boxes
                </li>
                <li className="flex items-center">
                  <span className="text-red-700 mr-2">✓</span> Free delivery in
                  Amravati
                </li>
                <li className="flex items-center">
                  <span className="text-red-700 mr-2">✓</span> Personal message
                  option
                </li>
                <li className="flex items-center">
                  <span className="text-red-700 mr-2">✓</span> Premium packaging
                </li>
              </ul>
              <button className="bg-red-700 text-white px-6 py-3 rounded-full hover:bg-red-800 transition duration-300 active:scale-95 transform">
                Create Custom Gift Box
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chocolates;
  // const chocolates = [
  //   {
  //     id: 1,
  //     name: "Dark Chocolate Box",
  //     image: "/images/darkchocobox.jpg",
  //     description: "Assorted dark chocolates",
  //     price: 450,
  //   },
  //   {
  //     id: 2,
  //     name: "Milk Chocolate Box",
  //     image: "/images/milkchoco.jpg",
  //     description: "Creamy milk chocolates",
  //     price: 400,
  //   },
  //   {
  //     id: 3,
  //     name: "Chocolate Truffles",
  //     image: "/images/trufflechoco.jpg",
  //     description: "Assorted chocolate truffles",
  //     price: 350,
  //   },
  //   {
  //     id: 4,
  //     name: "White Chocolate",
  //     image: "/images/whitechoco.jpeg",
  //     description: "Premium white chocolate",
  //     price: 380,
  //   },
  //   {
  //     id: 5,
  //     name: "Chocolate Cookies",
  //     image: "/images/chocolstechipcoo.jpg",
  //     description: "Chocolate chip cookies",
  //     price: 200,
  //   },
  //   {
  //     id: 6,
  //     name: "Chocolate Brownie",
  //     image: "/images/chocobrownie.jpg",
  //     description: "Fudgy chocolate brownie",
  //     price: 120,
  //   },
  //   {
  //     id: 7,
  //     name: "Chocolate Mousse",
  //     image: "/images/chocomousse.jpg",
  //     description: "Creamy chocolate mousse",
  //     price: 180,
  //   },
  //   {
  //     id: 8,
  //     name: "Choco-Lava Cake",
  //     image: "/images/chocolava.jpg",
  //     description: "Rich chocolate-lava cake",
  //     price: 599,
  //   },
  // ];
