import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addressSidebarOpen, setAddressSidebarOpen] = useState(false);
  const [addAddressSidebarOpen, setAddAddressSidebarOpen] = useState(false);
  const [addressSummaryVisible, setAddressSummaryVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('0.5kg');
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Sample addresses data
  const addresses = [
    {
      id: 1,
      name: "Purva Vikhe",
      address: "Saimandir, 137 Khalsa Hostel, Sai Nagar, Amravati, Maharashtra, 444607",
      phone: "9503817926"
    },
    {
      id: 2,
      name: "Vedanti Tawar",
      address: "40A, New Prabhat Colony, Shankar Nagar Road, Amravati, Maharashtra, 444607",
      phone: "7756896725"
    }
  ];

  // Price mapping
  const priceTable = {
    '350g': 300,
    '0.5kg': 349,
    '1kg': 699,
    '1.5kg': 1049,
    '2kg': 1399,
    '2.5kg': 1749,
    '3kg': 2099,
    '3.5kg': 2449,
    '4kg': 2799,
    '4.5kg': 3149,
    '5kg': 3499,
    'Customize': 0
  };

  const unitPrice = priceTable[size] || 349;
  const discount = 50;
  const totalPrice = unitPrice * quantity;
  const finalPrice = totalPrice - discount;

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

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

  const handleSaveAddress = () => {
    // Handle address saving logic here
    setAddressSummaryVisible(true);
    closeAddressSidebar();
  };

  const handleChangeAddress = () => {
    setAddressSummaryVisible(false);
    openAddressSidebar();
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="font-bold text-3xl text-purple-700 ml-8 mt-6">Nandini Cakes</div>

      <div className="flex flex-col md:flex-row justify-center gap-10 mt-8 px-4">
        {/* Main Content */}
        <div className="w-full max-w-lg">
          <div className="text-lg font-medium mb-4">Product Details</div>
          <div className="bg-white border rounded-lg shadow-sm mb-6">
            <div className="flex items-start p-4 gap-3">
              <img 
                src="/images/butterscotchcake.webp" 
                alt="Butterscotch Cake" 
                className="w-16 h-16 rounded-md border object-cover"
              />
              <div className="flex-1 pr-2">
                <div className="text-base font-medium text-gray-900 flex items-center justify-between">
                  Butterscotch Cake...
                  <button 
                    onClick={openSidebar}
                    className="text-purple-700 underline text-sm ml-2"
                  >
                    EDIT
                  </button>
                </div>
                <div className="flex items-baseline space-x-2 text-gray-800 mt-1">
                  <span className="font-bold text-lg">₹{unitPrice}</span>
                  <span className="text-gray-400 line-through text-base">₹{unitPrice + 50}</span>
                  <span className="text-green-700 text-base font-semibold">7% Off</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Please ensure order details are correct — replacement will not be provided<br />
                  <span>Size: {size}</span> <span className="ml-4">Qty: {quantity}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between border-t px-4 py-2 text-sm text-gray-600">
              <span>100% eggless, hygienically prepared, and delivered with care.</span>
              <span className="text-green-700">Free Delivery</span>
            </div>
          </div>

          {/* Address Summary */}
          {addressSummaryVisible && selectedAddress && (
            <div className="bg-white border rounded-lg shadow-sm my-4">
              <div className="p-5 relative">
                <div className="font-bold text-gray-900 text-lg mb-1">
                  {selectedAddress.name}
                </div>
                <button 
                  onClick={handleChangeAddress}
                  className="absolute top-5 right-5 text-fuchsia-700 font-semibold text-base"
                >
                  CHANGE
                </button>
                <div className="text-gray-700 mt-1 text-sm">
                  {selectedAddress.address}
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
          <div className="text-lg font-medium mb-3">Price Details ({quantity} Items)</div>
          <div className="bg-white border rounded-lg p-5 mb-5">
            <div className="flex justify-between mb-1 text-gray-800">
              <span>Total Product Price</span>
              <span>+ ₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-green-700 mb-2">
              <span>Total Discounts</span>
              <span>- ₹{discount}</span>
            </div>
            <div className="flex justify-between mt-3 mb-2 font-bold text-lg text-gray-900">
              <span>Order Total</span>
              <span>₹{finalPrice}</span>
            </div>
            <div className="bg-green-100 border border-green-200 text-green-700 text-center rounded mb-2 px-2 py-1 text-sm">
              Yay! Your total discount is ₹{discount}
            </div>
            <div className="text-xs text-gray-600 text-center mb-2">
              Clicking on 'Continue' will not deduct any money
            </div>
            <button 
              onClick={openAddressSidebar}
              className="w-full bg-purple-700 text-white rounded py-2 text-base font-semibold mt-2 mb-4 hover:bg-purple-800 transition"
            >
              Select Delivery Address
            </button>
          </div>

          {/* Security Banner */}
          <div className="w-full h-26 bg-gray-50 border rounded-lg overflow-hidden">
            <img 
              src="/images/secure1.png"
              alt="Delivery Safety" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Edit Item Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity"
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
                src="/images/butterscotchcake.webp" 
                alt="Butterscotch Cake" 
                className="w-14 h-14 rounded-md border object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold">Butterscotch Cake</div>
                <div className="flex gap-2 items-center mt-1">
                  <span className="font-bold text-gray-800 text-lg">₹{unitPrice}</span>
                  <span className="line-through text-gray-300">₹{unitPrice + 50}</span>
                  <span className="text-green-700 font-semibold text-base">7% Off</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 p-6 mb-8">
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm">Size</label>
                <select 
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="350g">350g</option>
                  <option value="0.5kg">0.5kg</option>
                  <option value="1kg">1kg</option>
                  <option value="1.5kg">1.5kg</option>
                  <option value="2kg">2kg</option>
                  <option value="2.5kg">2.5kg</option>
                  <option value="3kg">3kg</option>
                  <option value="3.5kg">3.5kg</option>
                  <option value="4kg">4kg</option>
                  <option value="4.5kg">4.5kg</option>
                  <option value="5kg">5kg</option>
                  <option value="Customize">Customize</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm">Qty</label>
                <div className="flex items-center border rounded px-2">
                  <button 
                    onClick={decreaseQuantity}
                    className="text-lg text-gray-400 px-1 hover:text-purple-700"
                  >
                    -
                  </button>
                  <span className="mx-2">{quantity}</span>
                  <button 
                    onClick={increaseQuantity}
                    className="text-lg text-gray-400 px-1 hover:text-purple-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center p-6 mb-5">
              <div className="font-semibold text-gray-700">Total Price</div>
              <span className="text-lg font-bold">₹{totalPrice}</span>
            </div>

            <div className="p-6 border-t mt-auto">
              <button className="w-full bg-purple-700 text-white py-2 rounded text-lg font-semibold hover:bg-purple-800 transition">
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
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
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
              {addresses.map(address => (
                <div key={address.id} className="border rounded-lg p-4 relative">
                  <input 
                    type="radio" 
                    name="address" 
                    className="absolute right-4 top-4 accent-purple-600"
                    onChange={() => setSelectedAddress(address)}
                    checked={selectedAddress?.id === address.id}
                  />
                  <h3 className="font-semibold text-gray-900">{address.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{address.address}</p>
                  <p className="text-gray-600 text-sm mt-2">📞 {address.phone}</p>
                  <button className="text-purple-600 text-sm mt-3 hover:underline">
                    EDIT
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <button 
                onClick={openAddAddressSidebar}
                className="w-full border border-purple-600 text-purple-600 py-2 rounded-lg mb-3 hover:bg-purple-50"
              >
                + Add New Address
              </button>
              <button 
                onClick={() => selectedAddress && handleDeliver(selectedAddress)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
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
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
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
              <input type="text" placeholder="Name" className="w-full border-b py-2 outline-none" />
              <input type="text" placeholder="Contact Number" className="w-full border-b py-2 outline-none" />
              <input type="text" placeholder="House / Building Name" className="w-full border-b py-2 outline-none" />
              <input type="text" placeholder="Road / Area / Colony" className="w-full border-b py-2 outline-none" />
              <input type="text" placeholder="Pincode" className="w-full border-b py-2 outline-none" />
              <input type="text" placeholder="City" className="w-full border-b py-2 outline-none" />
              <input type="text" placeholder="State" className="w-full border-b py-2 outline-none" />
            </div>
            
            <div className="p-4 border-t">
              <button 
                onClick={handleSaveAddress}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
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