import React, { useState, useEffect } from "react";
import { useCart } from '../context/CartContext';
import { useNotification } from '../hooks/useNotification';

const Birthday = () => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [birthdayCakes, setBirthdayCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBirthdayCakes = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('http://localhost:5000/api/products/category/birthday');
        
        if (!response.ok) {
          throw new Error('Failed to fetch birthday cakes');
        }
        
        const data = await response.json();
        
        // Check if the response has the expected structure
        if (data.success && data.products) {
          setBirthdayCakes(data.products);
        } else if (Array.isArray(data)) {
          // If the API returns direct array (without success wrapper)
          setBirthdayCakes(data);
        } else {
          throw new Error(data.message || 'Failed to load birthday cakes');
        }
        
      } catch (error) {
        console.error('Error fetching birthday cakes:', error);
        setError('Failed to load birthday cakes from server');
        setBirthdayCakes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdayCakes();
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
          <p className="mt-4 text-xl text-gray-600">Loading birthday cakes...</p>
        </div>
      </div>
    );
  }

  if (error && birthdayCakes.length === 0) {
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
      {/* Birthday Cakes Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Birthday Cakes
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Make every birthday special with our custom-designed cakes
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

      {/* Birthday Cakes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {birthdayCakes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {birthdayCakes.map((cake) => (
                <div
                  key={cake._id || cake.id}
                  className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                >
                  <div className="h-64 bg-gray-200 relative flex items-center justify-center overflow-hidden">
                    <img 
                      src={getImageUrl(cake)} 
                      alt={cake.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-cake.jpg';
                      }}
                    />
                    {cake.isEggless && (
                      <span className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                        Eggless
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{cake.name}</h3>
                    <p className="text-gray-600 mb-4">{cake.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-red-700">
                        ₹{cake.price}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(cake)}
                        disabled={cake.stock === 0}
                        className={`bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition duration-300 active:scale-95 transform ${
                          cake.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {cake.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                    {cake.stock > 0 && cake.stock < 5 && (
                      <p className="text-orange-600 text-sm mt-2">
                        Only {cake.stock} left!
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">No birthday cakes found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Cake Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Custom Birthday Cakes</h2>
              <p className="text-gray-600 mb-6">
                We specialize in creating personalized birthday cakes that match
                your theme and preferences. Tell us your ideas, and we'll bring
                them to life!
              </p>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-center">
                  <span className="text-red-700 mr-2">✓</span> Custom designs
                  and themes
                </li>
                <li className="flex items-center">
                  <span className="text-red-700 mr-2">✓</span> Photo printing
                  available
                </li>
                <li className="flex items-center">
                  <span className="text-red-700 mr-2">✓</span> Various sizes and
                  flavors
                </li>
                <li className="flex items-center">
                  <span className="text-red-700 mr-2">✓</span> Fresh ingredients
                </li>
              </ul>
              <a
                href="https://wa.me/7756896725"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block bg-red-700 text-white px-6 py-3 rounded-full hover:bg-red-800 transition duration-300 active:scale-95 transform"
              >
                Order Custom Cake
              </a>
            </div>
            <div>
              <img
                src="/images/customimage.jpg"
                alt="Custom Cake"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Birthday;
 

  // const birthdayCakes = [
  //   {
  //     id: 1,
  //     name: "Chocolate Birthday Cake",
  //     image: "/images/chococake.jpg",
  //     description: "Rich chocolate cake with buttercream frosting",
  //     price: 799,
  //   },
  //   {
  //     id: 2,
  //     name: "Butterscotch Cake",
  //     image: "/images/butterscotchcake.webp",
  //     description: "Delicious butterscotch flavor with cream",
  //     price: 599,
  //   },
  //   {
  //     id: 3,
  //     name: "Rainbow Cake",
  //     image: "/images/rainbowcake.jpg",
  //     description: "Colorful layers with vanilla frosting",
  //     price: 999,
  //   },
  //   {
  //     id: 4,
  //     name: "Princess Theme Cake",
  //     image: "/images/princess-cake.webp",
  //     description: "Perfect for princess-themed birthdays",
  //     price: 1299,
  //   },
  //   {
  //     id: 5,
  //     name: "Superhero Cake",
  //     image: "/images/herocake.jpg",
  //     description: "For the little superhero in your life",
  //     price: 1199,
  //   },
  //   {
  //     id: 6,
  //     name: "Photo Cake",
  //     image: "/images/photocake.jpg",
  //     description: "Custom photo printed on cake",
  //     price: 1499,
  //   },
  // ];

  