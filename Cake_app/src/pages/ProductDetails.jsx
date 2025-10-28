import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // In a real app, you would fetch product data based on the ID
  useEffect(() => {
    // Mock product data - in real app, fetch from API or context
    const mockProduct = {
      id: id,
      name: 'Chocolate Truffle Cake',
      image: '/images/chocotruffle.webp',
      description: 'Rich chocolate cake with creamy truffle filling and chocolate ganache. Perfect for any celebration.',
      price: 799,
      details: [
        'Made with premium Belgian chocolate',
        'Fresh cream filling',
        'Serves 8-10 people',
        'Available in 1kg, 2kg, and 3kg sizes',
        '24 hours advance order required'
      ]
    };
    setProduct(mockProduct);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/" className="text-red-700 hover:text-red-800">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/best-sellers" className="text-red-700 hover:text-red-800">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div 
              className="bg-cover bg-center h-96 rounded-lg shadow-lg"
              style={{ backgroundImage: `url(${product.image})` }}
            ></div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>
            <p className="text-2xl font-bold text-red-700 mb-6">₹{product.price}</p>
            
            <p className="text-gray-600 mb-6 text-lg">{product.description}</p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Product Details:</h3>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span className="text-gray-600">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <label htmlFor="quantity" className="font-semibold">Quantity:</label>
                <select id="quantity" className="border border-gray-300 rounded px-3 py-2">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="bg-red-700 text-white px-8 py-3 rounded-full hover:bg-red-800 transition duration-300 font-semibold flex-1">
                Add to Cart
              </button>
              <button className="border-2 border-red-700 text-red-700 px-8 py-3 rounded-full hover:bg-red-700 hover:text-white transition duration-300 font-semibold">
                Buy Now
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800">
                <i className="fas fa-shipping-fast mr-2"></i>
                Free delivery in Amravati for orders above ₹500
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <i className="fas fa-award text-3xl text-red-700 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600">Made with the finest ingredients</p>
          </div>
          <div className="text-center p-6">
            <i className="fas fa-shipping-fast text-3xl text-red-700 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Same day delivery available</p>
          </div>
          <div className="text-center p-6">
            <i className="fas fa-undo text-3xl text-red-700 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
            <p className="text-gray-600">100% satisfaction guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;