// src/services/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function for authenticated requests
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Create the API object
const api = {
  // Products
  getProducts: (query = '') => 
    authFetch(`${API_BASE}/products${query}`),
  
  getProduct: (id) => 
    authFetch(`${API_BASE}/products/${id}`),

  getCategories: () =>
    authFetch(`${API_BASE}/products/categories`),

  // Auth
  register: (userData) => 
    authFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  
  login: (userData) => 
    authFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  getProfile: () =>
    authFetch(`${API_BASE}/auth/profile`),

  // Users
  updateProfile: (userData) =>
    authFetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),

  // Addresses
  getAddresses: () =>
    authFetch(`${API_BASE}/users/addresses`),

  addAddress: (addressData) =>
    authFetch(`${API_BASE}/users/addresses`, {
      method: 'POST',
      body: JSON.stringify(addressData)
    }),

  updateAddress: (addressId, addressData) =>
    authFetch(`${API_BASE}/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    }),

  deleteAddress: (addressId) =>
    authFetch(`${API_BASE}/users/addresses/${addressId}`, {
      method: 'DELETE'
    }),

  setDefaultAddress: (addressId) =>
    authFetch(`${API_BASE}/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify({ isDefault: true })
    }),

  // Orders
  createOrder: (orderData) => 
    authFetch(`${API_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),

  getOrders: () =>
    authFetch(`${API_BASE}/orders`),

  getOrder: (orderId) =>
    authFetch(`${API_BASE}/orders/${orderId}`),

  // Cart
  getCart: () =>
    authFetch(`${API_BASE}/cart`),

  addToCart: (productData) =>
    authFetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      body: JSON.stringify(productData)
    }),

  updateCartItem: (itemId, quantity) =>
    authFetch(`${API_BASE}/cart/update`, {
      method: 'PUT',
      body: JSON.stringify({ itemId, quantity })
    }),

  removeFromCart: (itemId) =>
    authFetch(`${API_BASE}/cart/remove`, {
      method: 'DELETE',
      body: JSON.stringify({ itemId })
    }),

  clearCart: () =>
    authFetch(`${API_BASE}/cart/clear`, {
      method: 'DELETE'
    }),

  // Admin Endpoints
  admin: {
    // Dashboard
    getDashboardStats: () =>
      authFetch(`${API_BASE}/admin/dashboard/stats`),

    // Products Management
    getAdminProducts: (query = '') =>
      authFetch(`${API_BASE}/admin/products${query}`),

    createProduct: (productData) =>
      authFetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        body: JSON.stringify(productData)
      }),

    updateProduct: (productId, productData) =>
      authFetch(`${API_BASE}/admin/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      }),

    deleteProduct: (productId) =>
      authFetch(`${API_BASE}/admin/products/${productId}`, {
        method: 'DELETE'
      }),

    // Orders Management
    getAdminOrders: (query = '') =>
      authFetch(`${API_BASE}/admin/orders${query}`),

    updateOrderStatus: (orderId, statusData) =>
      authFetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData)
      }),

    // Users Management
    getAdminUsers: (query = '') =>
      authFetch(`${API_BASE}/admin/users${query}`),

    createUser: (userData) =>
      authFetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        body: JSON.stringify(userData)
      }),

    updateUser: (userId, userData) =>
      authFetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      }),

    deleteUser: (userId) =>
      authFetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE'
      }),
  }
};

export default api;