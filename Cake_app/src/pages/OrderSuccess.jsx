import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order details from localStorage (saved during order creation)
    const latestOrder = localStorage.getItem('latestOrder');
    const savedAddress = localStorage.getItem('selectedAddress');

    console.log('Latest order from localStorage:', latestOrder);
    console.log('Saved address from localStorage:', savedAddress);

    if (latestOrder) {
      try {
        const orderData = JSON.parse(latestOrder);
        
        setOrderDetails({
          items: orderData.items || [],
          address: orderData.address || (savedAddress ? JSON.parse(savedAddress) : null),
          total: orderData.total || 0,
          orderId: orderData.orderId || `ORD${Date.now()}`,
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
        });

        // Clear cart and localStorage data
        clearCart();
        localStorage.removeItem('selectedAddress');
        
      } catch (error) {
        console.error('Error parsing order data:', error);
        setOrderDetails(getFallbackOrderData());
      }
    } else {
      // If no order data in localStorage, try to create from current cart
      setOrderDetails(getFallbackOrderData());
    }
    
    setLoading(false);
  }, [clearCart]);

  // Fallback order data if nothing is found
  const getFallbackOrderData = () => {
    return {
      items: [],
      address: null,
      total: 0,
      orderId: `ORD${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails || orderDetails.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">We couldn't find your order details.</p>
          <p className="text-gray-500 text-sm mb-6">
            This might happen if you refreshed the page or the order data was cleared.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/best-sellers" 
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Shop Now
            </Link>
            <Link 
              to="/profile" 
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-300"
            >
              Check My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-700 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">🎂 Nandini Cakes</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="text-6xl mb-6">🎉</div>
          
          {/* Success Message */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-xl text-gray-600 mb-2">Your order has been placed successfully.</p>
          <p className="text-green-600 font-semibold mb-8">
            Order ID: {orderDetails.orderId}
          </p>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Order Summary</h3>
            
            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Items Ordered:</h4>
              {orderDetails.items.length > 0 ? (
                orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.image || "/images/placeholder-cake.jpg"} 
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.price || 0) * (item.quantity || 1)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No items information available</p>
              )}
            </div>

            {/* Delivery Address */}
            {orderDetails.address && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Delivery Address:</h4>
                <div className="bg-white p-4 rounded border">
                  <p className="font-medium text-gray-800">{orderDetails.address.name}</p>
                  <p className="text-gray-600">{orderDetails.address.address}</p>
                  <p className="text-gray-600">{orderDetails.address.city}, {orderDetails.address.state} - {orderDetails.address.pincode}</p>
                  <p className="text-gray-600">📞 {orderDetails.address.phone}</p>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{orderDetails.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-medium">₹40</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="text-green-600 font-medium">-₹50</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold text-lg">Total Amount:</span>
                <span className="font-bold text-lg text-red-700">₹{orderDetails.total}</span>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-semibold">
                📅 Estimated Delivery: {orderDetails.estimatedDelivery}
              </p>
              <p className="text-blue-600 text-sm mt-1">
                We'll send you tracking details via SMS and WhatsApp
              </p>
            </div>
          </div>

          {/* Customer Support */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <h4 className="font-semibold text-yellow-800 mb-2">Need Help?</h4>
            <p className="text-yellow-700 text-sm">
              Contact us: <span className="font-semibold">📞 7756896725</span> | 
              WhatsApp: <span className="font-semibold">📱 7756896725</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/best-sellers"
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition duration-300 font-semibold text-center"
            >
              Continue Shopping
            </Link>
            <button 
              onClick={() => window.print()}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition duration-300 font-semibold"
            >
              Print Receipt
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center text-green-700 mb-2">
              <span className="mr-2">🔒</span>
              <span className="font-semibold">Order Secured</span>
            </div>
            <p className="text-green-600 text-sm">
              Your order is confirmed and being processed. You'll receive updates via SMS and email.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold mb-4">Nandini Cakes</h3>
          <p className="text-gray-400">Fresh cakes delivered to your doorstep in Amravati</p>
          <div className="mt-4 space-x-6">
            <span>📞 7756896725</span>
            <span>📍 Amravati, Maharashtra</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrderSuccess;