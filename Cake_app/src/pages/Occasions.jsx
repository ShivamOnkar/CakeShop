import React, { useState, useEffect } from "react";
import { useCart } from '../context/CartContext';
import { useNotification } from '../hooks/useNotification';

const Occasions = () => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('http://localhost:5000/api/products/category/occasion');
        
        if (!response.ok) {
          throw new Error('Failed to fetch occasion cakes');
        }
        
        const data = await response.json();
        
        // Check if the response has the expected structure
        if (data.success && data.products) {
          setOccasions(data.products);
        } else if (Array.isArray(data)) {
          // If the API returns direct array (without success wrapper)
          setOccasions(data);
        } else {
          throw new Error(data.message || 'Failed to load occasion cakes');
        }
        
      } catch (error) {
        console.error('Error fetching occasion cakes:', error);
        setError('Failed to load occasion cakes from server');
        setOccasions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOccasions();
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
          <p className="mt-4 text-xl text-gray-600">Loading occasion cakes...</p>
        </div>
      </div>
    );
  }

  if (error && occasions.length === 0) {
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
      {/* Occasions Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Occasion Cakes
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Perfect cakes for every celebration
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

      {/* Occasion Cakes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {occasions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {occasions.map((occasion) => (
                <div
                  key={occasion._id || occasion.id}
                  className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                >
                  <div className="h-64 bg-gray-200 relative flex items-center justify-center overflow-hidden">
                    <img 
                      src={getImageUrl(occasion)} 
                      alt={occasion.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-cake.jpg';
                      }}
                    />
                    {occasion.isEggless && (
                      <span className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                        Eggless
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{occasion.name}</h3>
                    <p className="text-gray-600 mb-4">{occasion.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-red-700">
                        ₹{occasion.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(occasion)}
                        disabled={occasion.stock === 0}
                        className={`bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition duration-300 active:scale-95 transform ${
                          occasion.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {occasion.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                    {occasion.stock > 0 && occasion.stock < 5 && (
                      <p className="text-orange-600 text-sm mt-2">
                        Only {occasion.stock} left!
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">No occasion cakes found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Order Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We specialize in custom cakes for all occasions. Share your ideas
            with us and we'll create the perfect cake for your celebration.
          </p>
          <div className="space-x-4">
            <a
              href="https://wa.me/7756896725"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-700 text-white px-8 py-3 rounded-full hover:bg-red-800 transition duration-300 active:scale-95 transform inline-block"
            >
              WhatsApp Us
            </a>
            <a
              href="tel:+918550989777"
              className="border-2 border-red-700 text-red-700 px-8 py-3 rounded-full hover:bg-red-700 hover:text-white transition duration-300 active:scale-95 transform inline-block"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Occasions;

  // const occasions = [
  //   {
  //     id: 1,
  //     name: 'Anniversary Cake',
  //     image: '/images/happyanniversary.png',
  //     description: 'Elegant cakes for your special milestones',
  //     price: 899
  //   },
  //   {
  //     id: 2,
  //     name: "Wedding Cake",
  //     image: "/images/wedding.jpg",
  //     description: "Grand wedding cakes for your big day",
  //     price: 1999,
  //   },
  //   {
  //     id: 3,
  //     name: "Baby Shower Cake",
  //     image: "/images/babyshower.jpg",
  //     description: "Adorable cakes for baby celebrations",
  //     price: 799,
  //   },
  //   {
  //     id: 4,
  //     name: 'Graduation Cake',
  //     image: '/images/graduation.png',
  //     description: 'Celebrate academic achievements',
  //     price: 699
  //   },
  //   {
  //     id: 5,
  //     name: 'Festival Special',
  //     image: '/images/festival-cake.png',
  //     description: 'Special cakes for festivals',
  //     price: 599
  //   },
  //   {
  //     id: 6,
  //     name: 'Corporate Cake',
  //     image: '/images/corporate-cake.png',
  //     description: 'Professional cakes for corporate events',
  //     price: 1299
  //   }
  // ];

  // const handleAddToCart = (product) => {
  //   addToCart(product);
  //    showNotification(`${product.name} added to cart! 🛒`, 'success');
  // };
