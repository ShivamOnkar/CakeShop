import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  
  // Example cart data with state for quantity management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Chocolate Truffle Cake",
      price: 799,
      quantity: 1,
      image: "/images/chocotruffle.webp",
      size: "1kg"
    },
    {
      id: 2,
      name: "Red Velvet Cake",
      price: 799,
      quantity: 1,
      image: "/images/redvelvet.jpg",
      size: "0.5kg"
    }
  ]);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  // Function to handle checkout
  const handleProceedToCheckout = () => {
    // You can pass cart data to checkout page if needed
    navigate('/checkout', { 
      state: { 
        cartItems,
        subtotal,
        deliveryFee,
        total
      }
    });
  };

  // Function to update quantity
  const updateQuantity = (id, change) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // Function to remove item from cart
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-4xl text-gray-400 mb-4">🛒</div>
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some delicious cakes to your cart!</p>
                <Link 
                  to="/best-sellers" 
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition duration-300 inline-block"
                >
                  Shop Best Sellers
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md">
                {cartItems.map(item => (
                   <div key={item.id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Size: {item.size}</p>
                      <p className="text-pink-600 font-bold">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300"
                      >
                        <span className="text-sm">-</span>
                      </button>
                      <span className="font-semibold px-2">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300"
                      >
                        <span className="text-sm">+</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700 transition duration-300"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition duration-300 mb-4"
                >
                  Proceed to Checkout
                </button>

                <Link 
                  to="/best-sellers" 
                  className="w-full border border-pink-600 text-pink-600 py-3 rounded-lg font-semibold hover:bg-pink-50 transition duration-300 text-center block"
                >
                  Continue Shopping
                </Link>

                {/* Security Badge */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="text-green-600 font-semibold">🔒 Secure Checkout</div>
                  <div className="text-green-500 text-sm mt-1">Your payment information is safe with us</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recently Viewed or Recommended Products */}
        {cartItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Sample recommended products */}
              {[
                { name: "Butterscotch Cake", price: 349, image: "🍰" },
                { name: "Black Forest Cake", price: 899, image: "🎂" },
                { name: "Pineapple Cake", price: 649, image: "🍍" },
                { name: "Cheese Cake", price: 999, image: "🧀" }
              ].map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition duration-300">
                  <div className="text-3xl mb-2">{product.image}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-pink-600 font-bold mb-3">₹{product.price}</p>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition duration-300">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;