const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Products
  getProducts: (query = '') => 
    fetch(`${API_BASE}/products${query}`).then(res => res.json()),
  
  getProduct: (id) => 
    fetch(`${API_BASE}/products/${id}`).then(res => res.json()),

  // Auth
  register: (userData) => 
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(res => res.json()),
  
  login: (userData) => 
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(res => res.json()),

  // Orders
  createOrder: (orderData) => 
    fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }).then(res => res.json())
};