import React from 'react';

const Chocolates = () => {
  const chocolates = [
    {
      id: 1,
      name: 'Dark Chocolate Box',
      image: '/images/darkchocobox.jpg',
      description: 'Assorted dark chocolates',
      price: 450
    },
    {
      id: 2,
      name: 'Milk Chocolate Box',
      image: '/images/milkchoco.jpg',
      description: 'Creamy milk chocolates',
      price: 400
    },
    {
      id: 3,
      name: 'Chocolate Truffles',
      image: '/images/trufflechoco.jpg',
      description: 'Assorted chocolate truffles',
      price: 350
    },
    {
      id: 4,
      name: 'White Chocolate',
      image: '/images/whitechoco.jpeg',
      description: 'Premium white chocolate',
      price: 380
    },
    {
      id: 5,
      name: 'Chocolate Cookies',
      image: '/images/chocolstechipcoo.jpg',
      description: 'Chocolate chip cookies',
      price: 200
    },
    {
      id: 6,
      name: 'Chocolate Brownie',
      image: '/images/chocobrownie.jpg',
      description: 'Fudgy chocolate brownie',
      price: 120
    },
    {
      id: 7,
      name: 'Chocolate Mousse',
      image: '/images/chocomousse.jpg',
      description: 'Creamy chocolate mousse',
      price: 180
    },
    {
      id: 8,
      name: 'Choco-Lava Cake',
      image: '/images/chocolava.jpg',
      description: 'Rich chocolate-lava cake',
      price: 599
    }
  ];

  return (
    <div>
      {/* Chocolates Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chocolates</h1>
          <p className="text-xl max-w-2xl mx-auto">Premium quality chocolates and desserts</p>
        </div>
      </section>

      {/* Chocolate Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {chocolates.map(chocolate => (
              <div key={chocolate.id} className="product-card bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${chocolate.image})` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{chocolate.name}</h3>
                  <p className="text-gray-600 mb-4">{chocolate.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-700">₹{chocolate.price}</span>
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

      {/* Chocolate Gifts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Chocolate Gift Boxes</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/images/chocogiftbox.jpg" alt="Chocolate Gift Box" className="rounded-lg shadow-lg w-full" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Perfect Gift for Every Occasion</h3>
              <p className="text-gray-600 mb-6">
                Our premium chocolate gift boxes are perfect for birthdays, anniversaries, festivals, 
                or just to show someone you care. Each box is carefully curated with our finest chocolates.
              </p>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-center"><i className="fas fa-check text-red-700 mr-2"></i> Customizable gift boxes</li>
                <li className="flex items-center"><i className="fas fa-check text-red-700 mr-2"></i> Free delivery in Amravati</li>
                <li className="flex items-center"><i className="fas fa-check text-red-700 mr-2"></i> Personal message option</li>
                <li className="flex items-center"><i className="fas fa-check text-red-700 mr-2"></i> Premium packaging</li>
              </ul>
              <button className="bg-red-700 text-white px-6 py-3 rounded-full hover:bg-red-800 transition duration-300">
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