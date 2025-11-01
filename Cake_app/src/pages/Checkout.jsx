import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../hooks/useNotification';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
   const { showNotification } = useNotification();
  const { cart, clearCart, getCartTotal, updateQuantity, removeFromCart } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addressSidebarOpen, setAddressSidebarOpen] = useState(false);
  const [addAddressSidebarOpen, setAddAddressSidebarOpen] = useState(false);
  const [addressSummaryVisible, setAddressSummaryVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Redirect to login if not authenticated
// In your existing Checkout component, update the useEffect:
useEffect(() => {
  if (!user) {
    showNotification('Please login to proceed with checkout', 'warning');
    navigate('/login', { 
      state: { 
        from: '/checkout',
        message: 'Please login to proceed with checkout'
      }
    });
  } else {
    // Fetch user addresses if logged in
    fetchUserAddresses();
  }
}, [user, navigate, showNotification]);

  // Fetch user addresses from backend
  const fetchUserAddresses = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const addresses = await response.json();
        setUserAddresses(addresses);
        
        // Auto-select default address if available
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          setAddressSummaryVisible(true);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Handle adding new address
  const handleSaveAddress = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/addresses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAddress)
      });
      
      if (response.ok) {
        const updatedAddresses = await response.json();
        setUserAddresses(updatedAddresses);
        
        // Select the newly added address
        const newAddr = updatedAddresses[updatedAddresses.length - 1];
        setSelectedAddress(newAddr);
        setAddressSummaryVisible(true);
        
        // Reset form and close sidebar
        setNewAddress({
          name: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: ''
        });
        closeAddressSidebar();
      } else {
        alert('Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Error saving address');
    }
  };

 // Handle placing order
// Handle placing order
const handlePlaceOrder = async () => {
  if (!selectedAddress || !user) {
    alert('Please select a delivery address');
    return;
  }
  
  setLoading(true);
  
  try {
    const token = localStorage.getItem('token');
    
    const orderData = {
      orderItems: cart.map(item => {
        const productId = item._id || item.id || item.productId;
        
        if (!productId) {
          throw new Error(`No product ID found for item: ${item.name}`);
        }
        
        return {
          product: productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "/images/butterscotchcake.webp"
        };
      }),
      shippingAddress: {
        name: selectedAddress.name,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        phone: selectedAddress.phone
      },
      paymentMethod: 'cod',
      itemsPrice: getCartTotal(),
      taxPrice: 0,
      shippingPrice: 40,
      totalPrice: getCartTotal() + 40 - (cart.length > 0 ? 50 : 0)
    };

    console.log('Sending order data:', orderData);

    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    // FIRST: Read the response once and store it
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error('Invalid response from server');
    }

    // THEN: Check if response was successful
    if (response.ok) {
      console.log('Order created successfully:', responseData);
       showNotification('Order placed successfully! 🎉', 'success');
      
      // Save order info for success page
      localStorage.setItem('latestOrder', JSON.stringify({
        orderId: responseData._id,
        total: responseData.totalPrice,
        address: responseData.shippingAddress,
        items: responseData.orderItems || cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      }));
      
      // Clear cart and navigate to success page
      clearCart();
      navigate('/order-success');
    } else {
      console.error('Order failed:', responseData);
      alert(responseData.message || 'Failed to place order');
    }
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Error placing order: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  // Calculate cart totals
  const deliveryFee = 40;
  const subtotal = getCartTotal();
  const discount = cart.length > 0 ? 50 : 0;
  const totalPrice = subtotal + deliveryFee - discount;

  const openSidebar = (item) => {
    setEditingItem(item);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setEditingItem(null);
  };

  const openAddressSidebar = () => setAddressSidebarOpen(true);
  const closeAddressSidebar = () => {
    setAddressSidebarOpen(false);
    setAddAddressSidebarOpen(false);
  };

  const openAddAddressSidebar = () => {
    setAddressSidebarOpen(false);
    setAddAddressSidebarOpen(true);
  };

  const closeAddAddressSidebar = () => {
    setAddAddressSidebarOpen(false);
    setAddressSidebarOpen(true);
  };

  const handleDeliver = (address) => {
    setSelectedAddress(address);
    setAddressSummaryVisible(true);
    closeAddressSidebar();
  };

  const handleChangeAddress = () => {
    setAddressSummaryVisible(false);
    openAddressSidebar();
  };

  const handleUpdateItem = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
    closeSidebar();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some delicious items to proceed to checkout</p>
          <Link 
            to="/best-sellers" 
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="font-bold text-3xl text-red-700 ml-8 mt-6">Nandini Cakes</div>

      <div className="flex flex-col md:flex-row justify-center gap-10 mt-8 px-4">
        {/* Main Content */}
        <div className="w-full max-w-2xl">
          <div className="text-lg font-medium mb-4">Product Details</div>
          
          {/* Cart Items */}
          {cart.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg shadow-sm mb-6">
              <div className="flex items-start p-4 gap-3">
                <img 
                  src={item.image || "/images/butterscotchcake.webp"} 
                  alt={item.name} 
                  className="w-16 h-16 rounded-md border object-cover"
                />
                <div className="flex-1 pr-2">
                  <div className="text-base font-medium text-gray-900 flex items-center justify-between">
                    {item.name}
                    <button 
                      onClick={() => openSidebar(item)}
                      className="text-red-700 underline text-sm ml-2"
                    >
                      EDIT
                    </button>
                  </div>
                  <div className="flex items-baseline space-x-2 text-gray-800 mt-1">
                    <span className="font-bold text-lg">₹{item.price}</span>
                    <span className="text-gray-400 line-through text-base">₹{item.price + 50}</span>
                    <span className="text-green-700 text-base font-semibold">7% Off</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Please ensure order details are correct — replacement will not be provided<br />
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between border-t px-4 py-2 text-sm text-gray-600">
                <span>100% eggless, hygienically prepared, and delivered with care.</span>
                <span className="text-green-700">Free Delivery</span>
              </div>
            </div>
          ))}

          {/* Address Summary */}
          {addressSummaryVisible && selectedAddress && (
            <div className="bg-white border rounded-lg shadow-sm my-4">
              <div className="p-5 relative">
                <div className="font-bold text-gray-900 text-lg mb-1">
                  {selectedAddress.name}
                </div>
                <button 
                  onClick={handleChangeAddress}
                  className="absolute top-5 right-5 text-red-700 font-semibold text-base"
                >
                  CHANGE
                </button>
                <div className="text-gray-700 mt-1 text-sm">
                  {selectedAddress.address}
                </div>
                <div className="text-gray-700 text-sm">
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                </div>
                <div className="mt-2 text-gray-700 text-sm">
                  📞 {selectedAddress.phone}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full max-w-md">
          <div className="text-lg font-medium mb-3">Price Details ({cart.reduce((sum, item) => sum + item.quantity, 0)} Items)</div>
          <div className="bg-white border rounded-lg p-5 mb-5">
            <div className="flex justify-between mb-1 text-gray-800">
              <span>Total Product Price</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between mb-1 text-gray-800">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-green-700 mb-2">
              <span>Total Discounts</span>
              <span>- ₹{discount}</span>
            </div>
            <div className="flex justify-between mt-3 mb-2 font-bold text-lg text-gray-900 border-t pt-3">
              <span>Order Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="bg-green-100 border border-green-200 text-green-700 text-center rounded mb-2 px-2 py-1 text-sm">
              Yay! Your total discount is ₹{discount}
            </div>
            <div className="text-xs text-gray-600 text-center mb-2">
              Clicking on 'Continue' will not deduct any money
            </div>
            
            {!addressSummaryVisible ? (
              <button 
                onClick={openAddressSidebar}
                className="w-full bg-red-700 text-white rounded py-3 text-base font-semibold mt-2 mb-4 hover:bg-red-800 transition"
              >
                Select Delivery Address
              </button>
            ) : (
              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`w-full bg-red-700 text-white rounded py-3 text-base font-semibold mt-2 mb-4 hover:bg-red-800 transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
          </div>

          {/* Security Banner */}
          <div className="w-full h-26 bg-gray-50 border rounded-lg overflow-hidden">
            <img 
              src="/images/online-shopping.webp"
              alt="Delivery Safety" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Edit Item Sidebar */}
      {sidebarOpen && editingItem && (
        <>
          <div 
            className="fixed inset-0 z-40  bg-opacity-80 transition-opacity"
            onClick={closeSidebar}
          ></div>
          <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform">
            <div className="flex items-center justify-between border-b pb-3 p-6">
              <span className="font-semibold">EDIT ITEM</span>
              <button 
                onClick={closeSidebar}
                className="text-gray-400 hover:text-gray-500 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="flex gap-3 p-6 mb-3">
              <img 
                src={editingItem.image || "/images/butterscotchcake.webp"} 
                alt={editingItem.name} 
                className="w-14 h-14 rounded-md border object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold">{editingItem.name}</div>
                <div className="flex gap-2 items-center mt-1">
                  <span className="font-bold text-gray-800 text-lg">₹{editingItem.price}</span>
                  <span className="line-through text-gray-300">₹{editingItem.price + 50}</span>
                  <span className="text-green-700 font-semibold text-base">7% Off</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 p-6 mb-8">
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm">Qty</label>
                <div className="flex items-center border rounded px-2">
                  <button 
                    onClick={() => handleUpdateItem(editingItem.id, editingItem.quantity - 1)}
                    className="text-lg text-gray-400 px-1 hover:text-red-700"
                  >
                    -
                  </button>
                  <span className="mx-2">{editingItem.quantity}</span>
                  <button 
                    onClick={() => handleUpdateItem(editingItem.id, editingItem.quantity + 1)}
                    className="text-lg text-gray-400 px-1 hover:text-red-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center p-6 mb-5">
              <div className="font-semibold text-gray-700">Total Price</div>
              <span className="text-lg font-bold">₹{editingItem.price * editingItem.quantity}</span>
            </div>

            <div className="p-6 border-t mt-auto">
              <button 
                onClick={closeSidebar}
                className="w-full bg-red-700 text-white py-2 rounded text-lg font-semibold hover:bg-red-800 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </>
      )}

      {/* Address Selection Sidebar */}
      {addressSidebarOpen && (
        <>
          <div 
            className="fixed inset-0  bg-opacity-40 z-40"
            onClick={closeAddressSidebar}
          ></div>
          <div className="fixed top-0 right-0 w-full sm:w-1/3 max-w-sm h-full bg-white shadow-lg z-50 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-gray-800">SELECT DELIVERY ADDRESS</h2>
              <button 
                onClick={closeAddressSidebar}
                className="text-2xl text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </div>

            {/* Content: saved addresses */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {userAddresses.length > 0 ? (
                userAddresses.map(address => (
                  <div key={address._id} className="border rounded-lg p-4 relative">
                    <input 
                      type="radio" 
                      name="address" 
                      className="absolute right-4 top-4 accent-red-600"
                      onChange={() => setSelectedAddress(address)}
                      checked={selectedAddress?._id === address._id}
                    />
                    <h3 className="font-semibold text-gray-900">{address.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{address.address}</p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">📞 {address.phone}</p>
                    {address.isDefault && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                        Default
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No addresses saved. Please add an address.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <button 
                onClick={openAddAddressSidebar}
                className="w-full border border-red-600 text-red-600 py-2 rounded-lg mb-3 hover:bg-red-50"
              >
                + Add New Address
              </button>
              <button 
                onClick={() => selectedAddress && handleDeliver(selectedAddress)}
                disabled={!selectedAddress}
                className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 ${
                  !selectedAddress ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Deliver to this Address
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add Address Sidebar */}
      {addAddressSidebarOpen && (
        <>
          <div 
            className="fixed inset-0  bg-opacity-40 z-40"
            onClick={closeAddressSidebar}
          ></div>
          <div className="fixed top-0 right-0 w-full sm:w-1/3 max-w-sm h-full bg-white shadow-lg z-50 flex flex-col">
            <div className="flex items-center p-4 border-b">
              <button 
                onClick={closeAddAddressSidebar}
                className="text-xl text-gray-600 mr-2"
              >
                ←
              </button>
              <h2 className="font-semibold text-gray-800">ADD DELIVERY ADDRESS</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <input 
                type="text" 
                name="name"
                placeholder="Name" 
                className="w-full border-b py-2 outline-none"
                value={newAddress.name}
                onChange={handleInputChange}
              />
              <input 
                type="text" 
                name="phone"
                placeholder="Contact Number" 
                className="w-full border-b py-2 outline-none"
                value={newAddress.phone}
                onChange={handleInputChange}
              />
              <input 
                type="text" 
                name="address"
                placeholder="House / Building / Road / Area" 
                className="w-full border-b py-2 outline-none"
                value={newAddress.address}
                onChange={handleInputChange}
              />
              <input 
                type="text" 
                name="pincode"
                placeholder="Pincode" 
                className="w-full border-b py-2 outline-none"
                value={newAddress.pincode}
                onChange={handleInputChange}
              />
              <input 
                type="text" 
                name="city"
                placeholder="City" 
                className="w-full border-b py-2 outline-none"
                value={newAddress.city}
                onChange={handleInputChange}
              />
              <input 
                type="text" 
                name="state"
                placeholder="State" 
                className="w-full border-b py-2 outline-none"
                value={newAddress.state}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="p-4 border-t">
              <button 
                onClick={handleSaveAddress}
                disabled={!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode}
                className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 ${
                  !newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode 
                    ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Save Address and Continue
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;