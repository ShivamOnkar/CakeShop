import React from 'react';
import { Link } from 'react-router-dom';

const Birthday = () => {
  const birthdayCakes = [
    {
      id: 1,
      name: 'Chocolate Birthday Cake',
      image: '/images/chococake.jpg',
      description: 'Rich chocolate cake with buttercream frosting',
      price: 799
    },
    {
      id: 2,
      name: 'Butterscotch Cake',
      image: '/images/butterscotchcake.webp',
      description: 'Delicious butterscotch flavor with cream',
      price: 599
    },
    {
      id: 3,
      name: 'Rainbow Cake',
      image: '/images/rainbowcake.jpg',
      description: 'Colorful layers with vanilla frosting',
      price: 999
    },
    {
      id: 4,
      name: 'Princess Theme Cake',
      image: '/images/princess theme cake.webp',
      description: 'Perfect for princess-themed birthdays',
      price: 1299
    },
    {
      id: 5,
      name: 'Superhero Cake',
      image: '/images/herocake.jpg',
      description: 'For the little superhero in your life',
      price: 1199
    },
    {
      id: 6,
      name: 'Photo Cake',
      image: '/images/photocake.jpg',
      description: 'Custom photo printed on cake',
      price: 1499
    }
  ];

  return (
    <div>
      {/* Birthday Cakes Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Birthday Cakes</h1>
          <p className="text-xl max-w-2xl mx-auto">Make every birthday special with our custom-designed cakes</p>
        </div>
      </section>

      {/* Birthday Cakes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {birthdayCakes.map(cake => (
              <div key={cake.id} className="product-card bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${cake.image})` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{cake.name}</h3>
                  <p className="text-gray-600 mb-4">{cake.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-700">₹{cake.price}</span>
                    <button className="add-to-cart bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Cake Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Custom Birthday Cakes</h2>
              <p className="text-gray-600 mb-6">
                We specialize in creating personalized birthday cakes that match your theme and preferences. 
                Tell us your ideas, and we'll bring them to life!
              </p>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-center"><i className="fas fa-check text-red-700 mr-2"></i> Custom designs and themes</li>
                <li className="flex items-center"><i className="fas fa-check text-red-700 mr-2"></i> Photo printing available</li>
                <li className="flex items-center"><i className="fas fa-check text-red-700 mr-2"></i> Various sizes and flavors</li>
                <li className="flex items-center"><i className="fas fa-check text-red-700 mr-2"></i> Fresh ingredients</li>
              </ul>
              <a 
                href="https://wa.me/7756896725" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 inline-block bg-red-700 text-white px-6 py-3 rounded-full hover:bg-red-800 transition duration-300"
              >
                Order Custom Cake
              </a>
            </div>
            <div>
              <img src="/images/customimage.jpg" alt="Custom Cake" className="rounded-lg shadow-lg w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Birthday;