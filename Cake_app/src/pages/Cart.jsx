import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
    const { user } = useAuth();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal,
    clearCart 
  } = useCart();

  const deliveryFee = 40;
  const total = getCartTotal() + deliveryFee;

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: '/checkout',
          message: 'Please login to proceed with checkout'
        }
      });
      return;
    }
    navigate('/checkout');
  };

  const handleIncreaseQuantity = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  // Calculate total items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
 // If user is not logged in and cart is empty
  if (!user && cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to add items to cart</p>
          <Link 
            to="/login" 
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          {cart.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 transition duration-300 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cart.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl text-gray-400 mb-4">🛒</div>
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some delicious items to your cart!</p>
                <Link 
                  to="/best-sellers" 
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition duration-300 inline-block font-semibold"
                >
                  Shop Best Sellers
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cart.map(item => (
                  <div 
                    key={item.id} 
                    className="flex items-center p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition duration-200"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : null}
                      {!item.image && (
                        <span className="text-gray-400 text-2xl">🎂</span>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 ml-4 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                      <p className="text-red-600 font-bold mt-1">₹{item.price} each</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mx-4">
                      <button 
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300 active:scale-95"
                        aria-label="Decrease quantity"
                      >
                        <span className="text-sm font-semibold">-</span>
                      </button>
                      <span className="font-semibold px-2 min-w-8 text-center bg-gray-100 rounded-md py-1">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300 active:scale-95"
                        aria-label="Increase quantity"
                      >
                        <span className="text-sm font-semibold">+</span>
                      </button>
                    </div>
                    
                    {/* Price and Remove */}
                    <div className="ml-4 text-right min-w-24">
                      <p className="text-lg font-bold text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="mt-2 text-red-500 hover:text-red-700 transition duration-300 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3 text-gray-800">
                    <span>Total Amount</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 mb-4 active:scale-95 transform shadow-md"
                >
                  Proceed to Checkout
                </button>

                <Link 
                  to="/best-sellers" 
                  className="w-full border border-red-600 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition duration-300 text-center block active:scale-95 transform"
                >
                  Continue Shopping
                </Link>

                {/* Security Badge */}
                <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="flex items-center justify-center text-green-600 font-semibold mb-1">
                    <span className="mr-2">🔒</span>
                    Secure Checkout
                  </div>
                  <div className="text-green-500 text-xs">Your payment information is safe with us</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;