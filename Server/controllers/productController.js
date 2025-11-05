const Product = require("../models/Product");
const ImageKit = require("imagekit");

// ✅ Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (category && category !== "All") filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalProducts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    if (error.kind === "ObjectId")
      return res.status(404).json({ message: "Product not found" });
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;

    const products = await Product.find({ category })
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get bestseller products
// @route   GET /api/products/category/bestseller
// @access  Public
const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    console.error("Get bestsellers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
// @desc Create a product
const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, image } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Please provide name, category, and price" });
    }

    // ✅ Ensure image field format is uniform
    let imageData = [];

    if (typeof image === "string" && image.trim() !== "") {
      imageData = [{ url: image, alt: name }];
    } else if (Array.isArray(image) && image.length > 0) {
      imageData = image;
    } else if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}_${req.file.originalname}`,
        folder: "products",
      });
      imageData = [{ url: uploadResponse.url, alt: name }];
    } else {
      imageData = [{ url: "", alt: "No image" }];
    }

    const newProduct = new Product({
      name,
      category,
      price,
      description,
      stock: stock || 0,
      image: imageData,
      isAvailable: true,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("❌ Create product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, category, price, description, stock } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = price;
    if (description) product.description = description;
    if (stock !== undefined) product.stock = stock;

    // ✅ If new image file is uploaded, upload to ImageKit
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}_${req.file.originalname}`,
        folder: "products",
      });

      product.image = [{ url: uploadResponse.url, alt: name || product.name }];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  getBestSellers,
  createProduct,
  updateProduct,
  deleteProduct,
};
