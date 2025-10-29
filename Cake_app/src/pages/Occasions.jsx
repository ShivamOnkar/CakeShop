import React, { useState } from 'react';

const Occasions = () => {
  const [cart, setCart] = useState([]);

  const occasions = [
    {
      id: 1,
      name: 'Anniversary Cake',
      image: '/images/anniversary.jpg',
      description: 'Elegant cakes for your special milestones',
      price: 899
    },
    {
      id: 2,
      name: 'Wedding Cake',
      image: '/images/wedding.jpg',
      description: 'Grand wedding cakes for your big day',
      price: 1999
    },
    {
      id: 3,
      name: 'Baby Shower Cake',
      image: '/images/babyshower.jpg',
      description: 'Adorable cakes for baby celebrations',
      price: 799
    },
    {
      id: 4,
      name: 'Graduation Cake',
      image: '/images/graduation.jpg',
      description: 'Celebrate academic achievements',
      price: 699
    },
    {
      id: 5,
      name: 'Festival Special',
      image: '/images/festival.jpg',
      description: 'Special cakes for festivals',
      price: 599
    },
    {
      id: 6,
      name: 'Corporate Cake',
      image: '/images/corporate.jpg',
      description: 'Professional cakes for corporate events',
      price: 1299
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

  return (
    <div>
      {/* Occasions Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Occasion Cakes</h1>
          <p className="text-xl max-w-2xl mx-auto">Perfect cakes for every celebration</p>
        </div>
      </section>

      {/* Occasion Cakes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {occasions.map(occasion => (
              <div key={occasion.id} className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div 
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${occasion.image})` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{occasion.name}</h3>
                  <p className="text-gray-600 mb-4">{occasion.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-700">₹{occasion.price}</span>
                    <button 
                      onClick={() => addToCart(occasion)}
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

      {/* Custom Order Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We specialize in custom cakes for all occasions. Share your ideas with us and we'll create the perfect cake for your celebration.
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