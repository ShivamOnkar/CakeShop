import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: 'Mis. Nandini Tawar',
      role: 'Founder & Head Baker',
      description: 'With 10+ years of baking experience'
    },
    {
      name: 'Ms. Devendra Tawar',
      role: 'Pastry Chef',
      description: 'Specialized in French pastries'
    },
    {
      name: 'Radha Tawar',
      role: 'Cake Designer',
      description: 'Creative cake designs specialist'
    }
  ];

  const values = [
    {
      icon: 'fas fa-seedling',
      title: 'Fresh Ingredients',
      description: 'We source the freshest ingredients for all our products'
    },
    {
      icon: 'fas fa-hand-holding-heart',
      title: 'Customer First',
      description: 'Your satisfaction is our top priority'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Eco-Friendly',
      description: 'We use environmentally friendly packaging'
    },
    {
      icon: 'fas fa-star',
      title: 'Excellence',
      description: 'Striving for excellence in every product'
    }
  ];

  return (
    <div>
      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">About Nandini Cakes</h1>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img src="/images/about.jpg" alt="About Nandini Cakes" className="rounded-lg shadow-lg w-full" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Story Since 2020</h2>
              <p className="text-gray-600 mb-4">
                Nandini Cakes was founded in 2020 with a simple mission: to bring the finest quality 
                baked goods to the people of Amravati. What started as a small neighborhood bakery has 
                grown into one of Amravati's most beloved baking institutions.
              </p>
              <p className="text-gray-600 mb-6">
                For over 5 years, we've been committed to using only the highest quality ingredients, 
                traditional recipes, and innovative techniques to create baked goods that delight our customers.
              </p>
              <button className="bg-red-700 text-white px-6 py-3 rounded-full hover:bg-red-800 transition duration-300">
                Visit Our Store
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <i className="fas fa-award text-4xl text-red-700 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Quality Excellence</h3>
              <p className="text-gray-600">Award-winning recipes and premium ingredients</p>
            </div>
            <div className="p-6">
              <i className="fas fa-heart text-4xl text-red-700 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Made with Love</h3>
              <p className="text-gray-600">Every product baked with passion and care</p>
            </div>
            <div className="p-6">
              <i className="fas fa-users text-4xl text-red-700 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Community Focus</h3>
              <p className="text-gray-600">Serving the Amravati community for over 5 years</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <i className={`${value.icon} text-4xl text-red-700 mb-4`}></i>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-red-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-user text-4xl text-red-700"></i>
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-red-700 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;