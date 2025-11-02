import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../hooks/useNotification';

const Home = () => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch featured products (best sellers)
        const [bestSellersResponse, featuredResponse] = await Promise.all([
          fetch('http://localhost:5000/api/products/bestsellers?limit=4'),
          fetch('http://localhost:5000/api/products?isFeatured=true&limit=4')
        ]);

        if (!bestSellersResponse.ok || !featuredResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const bestSellersData = await bestSellersResponse.json();
        const featuredData = await featuredResponse.json();

        // Handle API response structure
        if (bestSellersData.success && bestSellersData.products) {
          setBestSellers(bestSellersData.products);
        } else if (Array.isArray(bestSellersData)) {
          setBestSellers(bestSellersData);
        }

        if (featuredData.success && featuredData.products) {
          setFeaturedProducts(featuredData.products);
        } else if (Array.isArray(featuredData)) {
          setFeaturedProducts(featuredData);
        } else if (bestSellersData.success && bestSellersData.products) {
          // If no featured products, use best sellers as featured
          setFeaturedProducts(bestSellersData.products);
        }

      } catch (error) {
        console.error('Error fetching home data:', error);
        setError('Failed to load products from server');
        // Use empty arrays instead of fallback data
        setFeaturedProducts([]);
        setBestSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const categories = [
    {
      id: 1,
      name: 'Birthday Cakes',
      image: '/images/birthday1.jpg',
      description: 'Customized cakes for all your celebrations',
      link: '/birthday'
    },
    {
      id: 2,
      name: 'Fresh Cookies',
      image: '/images/cookies.jpg',
      description: 'Daily fresh baked Cookies and Loaf cakes',
      link: '/bakery'
    },
    {
      id: 3,
      name: 'Pastries',
      image: '/images/pastry.webp',
      description: 'Delicious pastries for every taste',
      link: '/bakery'
    },
    {
      id: 4,
      name: 'Chocolates',
      image: '/images/chocolate.jpg',
      description: 'Premium quality Homemade chocolates and Desserts',
      link: '/chocolates'
    }
  ];

  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id || product.id,
      id: product._id || product.id,
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
          <p className="mt-4 text-xl text-gray-600">Loading delicious cakes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('/images/wallpaper.webp')` }}
      >
        <div className="absolute inset-0  bg-opacity-40"></div>
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-gray-300 text-4xl font-bold mb-4">
            Delicious 
          </h1>
          <h2 className="text-white text-5xl mb-4">
            Homemade Cakes
          </h2>
          <h1 className="text-6xl text-white mb-10 font-extrabold">
            NANDINI'S CAKES
          </h1>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-black text-white px-8 py-3 text-xl sm:text-2xl font-semibold hover:bg-gray-800 transition duration-300 rounded-lg"
            >
              Order Online
            </Link>
            <Link 
              to="/best-sellers" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 text-xl sm:text-2xl font-semibold hover:bg-white hover:text-black transition duration-300 rounded-lg"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Online Delivery Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">ONLINE CAKES DELIVERY IN AMRAVATI</h2>
          <p className="text-gray-800 text-center text-xl mb-10">
            Our online cake delivery in <span className="font-bold">Amravati</span> brings you freshly baked 
            <span className="font-bold"> healthy cakes</span> straight from the renowned 
            <span className="font-bold"> Nandini bakery</span>, where we prepare every cake with love, 
            attention to detail, and a promise of <span className="font-bold">freshness</span>, making them 
            the perfect gourmet treat for any celebration, and with our 
            <span className="font-bold"> same-day and midnight delivery</span> services across 
            <span className="font-bold"> Amravati city</span>, you never have to worry about last-minute 
            surprises for <span className="font-bold">birthdays, anniversaries, or parties</span>.
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

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Our Specialties</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover our wide range of freshly baked products made with the finest ingredients
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map(category => (
              <div key={category.id} className="category-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div 
                  className="h-48 bg-cover bg-center cursor-pointer"
                  style={{ backgroundImage: `url(${category.image})` }}
                  onClick={() => window.open(category.image, '_blank')}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    <Link to={category.link} className="hover:text-red-700">{category.name}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link to={category.link} className="text-red-700 font-semibold hover:text-red-800 inline-flex items-center">
                    Explore <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Featured Products</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Handpicked selections from our bakery
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <div key={product._id || product.id} className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                  <div className="h-56 bg-gray-200 relative flex items-center justify-center overflow-hidden">
                    <img 
                      src={getImageUrl(product)} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-cake.jpg';
                      }}
                    />
                    {product.isFeatured && (
                      <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        Featured
                      </span>
                    )}
                    {product.isEggless && (
                      <span className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                        Eggless
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
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
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Best Sellers</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Our most popular items loved by customers
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map(product => (
                <div key={product._id || product.id} className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
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
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
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
          </div>
        </section>
      )}

      {/* Retail Store Section */}
      <section 
        className="retail-store-bg h-screen w-full flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('/images/animationcake.jpg')` }}
      >
        <div className=" bg-opacity-40 h-full w-full flex items-center justify-center">
          <div className="text-white border-2 border-gray-900 p-8 bg-gray-900 bg-opacity-60 max-w-2xl">
            <h2 className="uppercase text-5xl font-bold mb-10 text-white text-center">Our retail store</h2>
            <p className="text-white text-2xl mb-10">
              <span className="font-bold text-3xl">
                Nandini's Cakes, New Prabhat Colony, Shankar Nagar Road, Navathe,
              </span>
              <br />
              <span className="block text-xl">Amravati, Maharashtra</span>
              <br />
              Mon-Fri, 11:00 AM - 12:00 Midnight
              <br />
              Saturday, 11:00 AM - 12:00 Midnight
              <br />
              Sunday, 11:00 AM - 12:00 Midnight
            </p>
          </div>
        </div>
      </section>

      {/* Additional Info Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
            Fresh & Delicious Cakes Delivery in Amravati for All Occasions
          </h2>
          <p className="text-gray-800 text-center text-xl mb-10">
            Celebrate every occasion with Nandini's Cakes! We offer freshly baked, delicious cakes for birthdays, anniversaries, and special events, with Same Day and Midnight Delivery all over Amravati. Order online and surprise your loved ones with cakes that look amazing and taste irresistible!
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-red-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Nandini Cakes?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p>We use only the finest ingredients to ensure the best taste and quality.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold mb-2">Fresh Daily</h3>
              <p>All our products are baked fresh daily to guarantee freshness.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Free Delivery</h3>
              <p>Free home delivery in Amravati for orders above ₹500.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;