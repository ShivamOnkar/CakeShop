const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
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

// -------------------- MULTER DISK STORAGE SETUP -------------------- //
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ✅ Save uploaded images inside /uploads
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    // ✅ Save file as a timestamp + original extension
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// -------------------- PUBLIC ROUTES -------------------- //

// Get all products or filter by query
router.get("/", async (req, res) => {
  try {
    const { category, limit, featured } = req.query;
    let query = {};

    if (category && category !== "all") query.category = category;
    if (featured === "true") query.isBestSeller = true;

    let productsQuery = Product.find(query);
    if (limit) productsQuery = productsQuery.limit(parseInt(limit));

    const products = await productsQuery.sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bestsellers
router.get("/bestsellers", async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all best sellers (optional route)
router.get("/category/bestseller/bestsellers", getBestSellers);

// -------------------- ADMIN ROUTES -------------------- //

// ✅ Create a new product (with image upload)
router.post("/", protect, restrictToAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const image = req.file ? req.file.filename : null;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image,
    });

    const created = await product.save();
    res.status(201).json({ message: "✅ Product created successfully", product: created });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update product (optional image upload)
router.put("/:id", protect, restrictToAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const updatedData = {
      name,
      description,
      price,
      category,
      stock,
    };

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "✅ Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Delete product
router.delete("/:id", protect, restrictToAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
