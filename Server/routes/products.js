const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/Product");
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  getBestSellers,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, restrictToAdmin } = require("../middleware/auth");

// -------------------- MULTER MEMORY STORAGE SETUP -------------------- //
// 🧠 Use memoryStorage so file.buffer is available for ImageKit upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -------------------- PUBLIC ROUTES -------------------- //

// ✅ Get all products with filters and pagination (controller handles logic)
router.get("/", getProducts);

// ✅ Get products by category
router.get("/category/:category", getProductsByCategory);

// ✅ Get bestseller products
router.get("/category/bestseller", getBestSellers);

// ✅ Get single product by ID
router.get("/:id", getProductById);

// -------------------- ADMIN ROUTES -------------------- //

// ✅ Create new product (requires admin)
router.post("/", protect, restrictToAdmin, upload.single("image"), createProduct);

// ✅ Update product (optional new image upload)
router.put("/:id", protect, restrictToAdmin, upload.single("image"), updateProduct);

// ✅ Delete product (requires admin)
router.delete("/:id", protect, restrictToAdmin, deleteProduct);

module.exports = router;
