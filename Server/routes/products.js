// Server/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  getBestSellers,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, restrictToAdmin } = require('../middleware/auth');

// Public routes
router.get('/', async (req, res) => {
  try {
    const { category, limit, featured } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.isBestSeller = true;
    }
    
    let productsQuery = Product.find(query);
    
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }
    
    const products = await productsQuery.sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bestsellers
router.get('/bestsellers', async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/category/bestseller/bestsellers', getBestSellers);

// Admin protected routes
router.post('/', protect, restrictToAdmin, createProduct);
router.put('/:id', protect, restrictToAdmin, updateProduct);
router.delete('/:id', protect, restrictToAdmin, deleteProduct);

module.exports = router;