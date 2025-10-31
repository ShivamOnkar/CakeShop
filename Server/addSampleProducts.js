const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Product = require('./models/Product');

// Load environment variables
const envPath = path.join(__dirname, '.env');
console.log('Loading .env from:', envPath);

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.log('❌ .env file not found');
  process.exit(1);
}

// Debug environment variables
console.log('\n=== ENVIRONMENT VARIABLES ===');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Loaded' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('PORT:', process.env.PORT || '5000 (default)');

// Use MONGODB_URI if available, otherwise fallback to MONGO_URI
const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI;

const sampleProducts = [
  {
    name: "Chocolate Truffle Cake",
    description: "Rich and decadent chocolate cake with creamy truffle frosting",
    price: 599,
    originalPrice: 699,
    category: "bestseller",
    images: [{ url: "/images/chocotruffle.webp", alt: "Chocolate Truffle Cake" }],
    isEggless: true,
    isVegetarian: true,
    stock: 15,
    tags: ["chocolate", "truffle", "cake"],
    weight: { value: 1, unit: "kg" },
    ingredients: ["Flour", "Cocoa", "Cream", "Butter", "Sugar"],
    isBestSeller: true,
    isFeatured: true
  },
  {
    name: "Red Velvet Cake",
    description: "Classic red velvet cake with cream cheese frosting",
    price: 699,
    originalPrice: 799,
    category: "bestseller",
    images: [{ url: "/images/redvelvet.jpg", alt: "Red Velvet Cake" }],
    isEggless: false,
    isVegetarian: true,
    stock: 8,
    tags: ["red velvet", "cream cheese", "cake"],
    weight: { value: 1.2, unit: "kg" },
    ingredients: ["Flour", "Cocoa", "Buttermilk", "Cream Cheese", "Sugar"],
    isBestSeller: true
  },
  {
    name: "Black Forest Cake",
    description: "Traditional black forest cake with cherries and cream",
    price: 799,
    originalPrice: 899,
    category: "birthday",
    images: [{ url: "/images/black-forest.jpeg", alt: "Black Forest Cake" }],
    isEggless: false,
    isVegetarian: true,
    stock: 10,
    tags: ["black forest", "cherries", "chocolate"],
    weight: { value: 1.5, unit: "kg" },
    ingredients: ["Flour", "Cocoa", "Cherries", "Cream", "Chocolate"],
    isBestSeller: true
  },
  {
    name: "Pineapple Cake",
    description: "Fresh pineapple cake with whipped cream",
    price: 549,
    originalPrice: 649,
    category: "bestseller",
    images: [{ url: "/images/Pineapple-Cake.jpg", alt: "Pineapple Cake" }],
    isEggless: true,
    isVegetarian: true,
    stock: 12,
    tags: ["pineapple", "fruit", "cake"],
    weight: { value: 1, unit: "kg" },
    ingredients: ["Flour", "Pineapple", "Cream", "Sugar", "Butter"],
    isBestSeller: true
  },
  {
    name: "French Croissant",
    description: "Buttery and flaky French croissants",
    price: 120,
    originalPrice: 150,
    category: "bakery",
    images: [{ url: "/images/French-Croissant1.jpeg", alt: "French Croissant" }],
    isEggless: false,
    isVegetarian: true,
    stock: 25,
    tags: ["croissant", "french", "bakery"],
    weight: { value: 60, unit: "g" },
    ingredients: ["Flour", "Butter", "Yeast", "Milk", "Sugar"]
  },
  {
    name: "Chocolate Donuts",
    description: "Soft donuts with rich chocolate glaze",
    price: 180,
    originalPrice: 220,
    category: "bakery",
    images: [{ url: "/images/choco-donuts.jpg", alt: "Chocolate Donuts" }],
    isEggless: true,
    isVegetarian: true,
    stock: 20,
    tags: ["donuts", "chocolate", "bakery"],
    weight: { value: 50, unit: "g" },
    ingredients: ["Flour", "Cocoa", "Sugar", "Milk", "Yeast"]
  },
  {
    name: "Cheese Garlic Bread",
    description: "Garlic bread with melted cheese topping",
    price: 199,
    originalPrice: 249,
    category: "bakery",
    images: [{ url: "/images/cheese-garlic-bread.jpg", alt: "Cheese Garlic Bread" }],
    isEggless: false,
    isVegetarian: true,
    stock: 18,
    tags: ["garlic bread", "cheese", "bakery"],
    weight: { value: 200, unit: "g" },
    ingredients: ["Bread", "Garlic", "Cheese", "Butter", "Herbs"]
  },
  {
    name: "Chocolate Muffins",
    description: "Soft and moist chocolate muffins",
    price: 240,
    originalPrice: 280,
    category: "bakery",
    images: [{ url: "/images/choco-muffins.jpg", alt: "Chocolate Muffins" }],
    isEggless: true,
    isVegetarian: true,
    stock: 30,
    tags: ["muffins", "chocolate", "bakery"],
    weight: { value: 80, unit: "g" },
    ingredients: ["Flour", "Cocoa", "Sugar", "Milk", "Baking Powder"]
  }
];

const addSampleProducts = async () => {
  try {
    // Check if connection string is available
    if (!connectionString) {
      console.error('\n❌ ERROR: No MongoDB connection string found!');
      console.log('Please make sure your .env file contains either:');
      console.log('MONGODB_URI=your_connection_string');
      console.log('or');
      console.log('MONGO_URI=your_connection_string');
      process.exit(1);
    }

    console.log('\n🔗 Connecting to MongoDB...');
    await mongoose.connect(connectionString);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    const deleteResult = await Product.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing products`);

    // Add sample products
    console.log('📦 Adding sample products...');
    const result = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully added ${result.length} products to the database`);

    // Show added products
    console.log('\n📋 Added Products:');
    result.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ₹${product.price} (${product.category})`);
    });

    console.log('\n🎉 Sample products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample products:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 TIP: Check your MongoDB username and password');
    } else if (error.message.includes('getaddrinfo')) {
      console.log('\n💡 TIP: Check your internet connection');
    }
    
    process.exit(1);
  }
};

addSampleProducts();