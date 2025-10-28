import React, { useEffect } from 'react';

const BestSellers = () => {
  useEffect(() => {
    // Mobile menu functionality
    const initializeMobileMenu = () => {
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      const mobileMenu = document.querySelector('.mobile-menu');
      const closeMenuBtn = document.querySelector('.close-menu');

      const toggleMobileMenu = () => {
        if (mobileMenu) {
          mobileMenu.classList.toggle('translate-x-0');
          mobileMenu.classList.toggle('-translate-x-full');
        }
      };

      if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
      }

      if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', toggleMobileMenu);
      }

      return () => {
        if (mobileMenuBtn) {
          mobileMenuBtn.removeEventListener('click', toggleMobileMenu);
        }
        if (closeMenuBtn) {
          closeMenuBtn.removeEventListener('click', toggleMobileMenu);
        }
      };
    };

    initializeMobileMenu();
  }, []);

  const bestSellers = [
    {
      id: 1,
      name: "Chocolate Truffle Cake",
      description: "Rich chocolate cake with creamy truffle",
      price: "₹599",
      image: "/images/product1.jpg"
    },
    {
      id: 2,
      name: "Red Velvet Cake",
      description: "Classic red velvet with cream cheese",
      price: "₹699",
      image: "/images/product2.jpg"
    },
    {
      id: 3,
      name: "French Croissant",
      description: "Buttery and flaky croissants",
      price: "₹120",
      image: "/images/product3.jpg"
    },
    {
      id: 4,
      name: "Chocolate Donuts",
      description: "Soft donuts with chocolate glaze",
      price: "₹180",
      image: "/images/product4.jpg"
    },
    {
      id: 5,
      name: "Black Forest Cake",
      description: "Classic black forest with cherries",
      price: "₹799",
      image: "/images/product5.jpg"
    },
    {
      id: 6,
      name: "Pineapple Cake",
      description: "Fresh pineapple with cream",
      price: "₹649",
      image: "/images/product6.jpg"
    },
    {
      id: 7,
      name: "Cheese Garlic Bread",
      description: "Garlic bread with cheese topping",
      price: "₹199",
      image: "/images/product7.jpg"
    },
    {
      id: 8,
      name: "Chocolate Muffins",
      description: "Soft chocolate muffins",
      price: "₹240",
      image: "/images/product8.jpg"
    }
  ];

  const reviews = [
    {
      id: 1,
      rating: 5,
      comment: "The chocolate truffle cake is amazing! Ordered for my daughter's birthday and everyone loved it.",
      name: "Rahul Sharma",
      location: "Pune",
      initial: "R"
    },
    {
      id: 2,
      rating: 5,
      comment: "Best bakery in Pune! Their red velvet cake is to die for. Always fresh and delicious.",
      name: "Priya Patel",
      location: "Amravati",
      initial: "P"
    },
    {
      id: 3,
      rating: 4.5,
      comment: "Regular customer for 5 years. Their breads and pastries are always fresh and reasonably priced.",
      name: "Sanjay Kumar",
      location: "Amravati",
      initial: "S"
    }
  ];

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // Implement your cart logic here
  };

  // Star icon SVG
  const StarIcon = ({ filled = true, half = false }) => (
    <svg 
      className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      {half ? (
        <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"/>
      ) : (
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      )}
    </svg>
  );

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} filled={true} />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" half={true} />);
    }

    // Add empty stars
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} filled={false} />);
    }

    return stars;
  };

  return (
    <div className="font-sans">
    
        

      {/* Best Sellers Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Best Sellers</h1>
          <p className="text-xl max-w-2xl mx-auto">Our most loved products by customers</p>
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
                  {/* Fallback if image doesn't load */}
                  <div className="text-gray-500 text-center">
                    {!product.image && (
                      <div className="text-lg font-semibold">{product.name}</div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-700">{product.price}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition duration-300"
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