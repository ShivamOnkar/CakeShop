import React from 'react';

const Contact = () => {
  const faqs = [
    {
      question: "Do you offer home delivery?",
      answer: "Yes, we offer free home delivery within Pune city limits for orders above ₹500."
    },
    {
      question: "How far in advance should I order a cake?",
      answer: "We recommend ordering at least 24 hours in advance for custom cakes. Regular cakes can be ordered same day."
    },
    {
      question: "Do you make eggless cakes?",
      answer: "Yes, we have a wide variety of eggless cakes and pastries available."
    },
    {
      question: "What are your payment options?",
      answer: "We accept cash, credit/debit cards, UPI, and online bank transfers."
    },
    {
      question: "Can I customize my cake design?",
      answer: "Absolutely! We specialize in custom cake designs. Share your ideas with us."
    },
    {
      question: "Do you have vegan options?",
      answer: "Yes, we offer a selection of vegan cakes and baked goods."
    }
  ];

  return (
    <div>
      {/* Contact Header */}
      <section className="bg-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">Get in touch with Nandini Cakes</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt text-red-700 text-xl mt-1 mr-4"></i>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Our Address</h3>
                    <p className="text-gray-600">
                      New Prabhat Colony, Shankar Nagar Road, Amravati, Maharashtra 444607
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <i className="fas fa-phone-alt text-red-700 text-xl mt-1 mr-4"></i>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone Number</h3>
                    <p className="text-gray-600">+91 8550989777</p>
                    <p className="text-gray-600">+91 8999091321</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <i className="fas fa-envelope text-red-700 text-xl mt-1 mr-4"></i>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email Address</h3>
                    <p className="text-gray-600">info@nandinicakes.com</p>
                    <p className="text-gray-600">orders@nandinicakes.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <i className="fas fa-clock text-red-700 text-xl mt-1 mr-4"></i>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Opening Hours</h3>
                    <p className="text-gray-600">Monday - Sunday: 11:00 AM - 12:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="https://m.facebook.com/114489843677281/" className="bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-800 transition duration-300">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://www.instagram.com/nandinicake_cookies" className="bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-800 transition duration-300">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://www.justdial.com/Amravati/Nandinis-Cake-Delivery-Service-Near-Shiv-Mandir-Nawathe" className="bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-800 transition duration-300">
                    <i className="fas fa-phone"></i>
                  </a>
                  <a href="https://wa.me/918550989777" className="bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-800 transition duration-300">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4">
                <input type="hidden" name="access_key" value="4ffade0a-e6f5-4db9-9129-a3c7e930b2e1" />

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent" 
                    placeholder="Your Name"
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
                    placeholder="Your Email"
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
                    placeholder="Your Phone Number"
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
                    placeholder="Subject"
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>

                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <button 
                  type="submit"
                  className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition duration-300 w-full font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;