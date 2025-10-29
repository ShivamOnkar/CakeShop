import React, { useState } from 'react';

const BestSellers = () => {
  const [cart, setCart] = useState([]);

  const bestSellers = [
    {
      id: 1,
      name: "Chocolate Truffle Cake",
      description: "Rich chocolate cake with creamy truffle",
      price: 599,
      image: "/images/product1.jpg"
    },
    {
      id: 2,
      name: "Red Velvet Cake",
      description: "Classic red velvet with cream cheese",
      price: 699,
      image: "/images/product2.jpg"
    },
    {
      id: 3,
      name: "French Croissant",
      description: "Buttery and flaky croissants",
      price: 120,
      image: "/images/product3.jpg"
    },
    {
      id: 4,
      name: "Chocolate Donuts",
      description: "Soft donuts with chocolate glaze",
      price: 180,
      image: "/images/product4.jpg"
    },
    {
      id: 5,
      name: "Black Forest Cake",
      description: "Classic black forest with cherries",
      price: 799,
      image: "/images/product5.jpg"
    },
    {
      id: 6,
      name: "Pineapple Cake",
      description: "Fresh pineapple with cream",
      price: 649,
      image: "/images/product6.jpg"
    },
    {
      id: 7,
      name: "Cheese Garlic Bread",
      description: "Garlic bread with cheese topping",
      price: 199,
      image: "/images/product7.jpg"
    },
    {
      id: 8,
      name: "Chocolate Muffins",
      description: "Soft chocolate muffins",
      price: 240,
      image: "/images/product8.jpg"
    }
  ];

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    alert(`${product.name} added to cart!`);
    localStorage.setItem('cart', JSON.stringify([...cart, { ...product, quantity: 1 }]));
  };

  // Rest of the BestSellers component remains the same...
  // [Keep the reviews section and star rendering logic]

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
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-700">₹{product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition duration-300 active:scale-95 transform"
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

      {/* Keep the Customer Reviews section */}
    </div>
  );
};

export default BestSellers;