// seedDatabase.js
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
  // Birthday Cakes
  {
    name: "Chocolate Birthday Cake",
    description: "Rich chocolate cake with buttercream frosting",
    price: 799,
    category: "birthday",
    images: [{ url: "/images/chococake.jpg", alt: "Chocolate Birthday Cake" }],
    isEggless: false,
    isBestSeller: true,
    stock: 15,
    tags: ["chocolate", "birthday", "buttercream"]
  },
  {
    name: "Butterscotch Cake",
    description: "Delicious butterscotch flavor with cream",
    price: 599,
    category: "birthday",
    images: [{ url: "/images/butterscotchcake.webp", alt: "Butterscotch Cake" }],
    isEggless: true,
    stock: 12,
    tags: ["butterscotch", "birthday"]
  },
  {
    name: "Rainbow Cake",
    description: "Colorful layers with vanilla frosting",
    price: 999,
    category: "birthday",
    images: [{ url: "/images/rainbowcake.jpg", alt: "Rainbow Cake" }],
    isEggless: false,
    stock: 8,
    tags: ["rainbow", "colorful", "vanilla"]
  },
  {
    name: "Princess Theme Cake",
    description: "Perfect for princess-themed birthdays",
    price: 1299,
    category: "birthday",
    images: [{ url: "/images/princess-cake.webp", alt: "Princess Theme Cake" }],
    isEggless: false,
    stock: 5,
    tags: ["princess", "theme", "custom"]
  },

  // Bakery Items
  {
    name: "French Croissant",
    description: "Buttery and flaky French croissants",
    price: 120,
    category: "bakery",
    images: [{ url: "/images/French-Croissant1.jpeg", alt: "French Croissant" }],
    isEggless: false,
    isBestSeller: true,
    stock: 25,
    tags: ["croissant", "french", "pastry"]
  },
  {
    name: "Chocolate Donuts",
    description: "Soft donuts with rich chocolate glaze",
    price: 180,
    category: "bakery",
    images: [{ url: "/images/choco-donuts.jpg", alt: "Chocolate Donuts" }],
    isEggless: true,
    stock: 20,
    tags: ["donuts", "chocolate", "glaze"]
  },
  {
    name: "Cheese Garlic Bread",
    description: "Garlic bread with melted cheese topping",
    price: 199,
    category: "bakery",
    images: [{ url: "/images/cheese-garlic-bread.jpg", alt: "Cheese Garlic Bread" }],
    isEggless: false,
    stock: 18,
    tags: ["garlic", "cheese", "bread"]
  },
  {
    name: "Chocolate Muffins",
    description: "Soft and moist chocolate muffins",
    price: 240,
    category: "bakery",
    images: [{ url: "/images/choco-muffins.jpg", alt: "Chocolate Muffins" }],
    isEggless: true,
    stock: 30,
    tags: ["muffins", "chocolate"]
  },

  // Chocolates
  {
    name: "Dark Chocolate Box",
    description: "Assorted dark chocolates",
    price: 450,
    category: "chocolate",
    images: [{ url: "/images/darkchocobox.jpg", alt: "Dark Chocolate Box" }],
    isEggless: true,
    stock: 20,
    tags: ["dark", "chocolate", "box"]
  },
  {
    name: "Milk Chocolate Box",
    description: "Creamy milk chocolates",
    price: 400,
    category: "chocolate",
    images: [{ url: "/images/milkchoco.jpg", alt: "Milk Chocolate Box" }],
    isEggless: true,
    stock: 25,
    tags: ["milk", "chocolate", "box"]
  },
  {
    name: "Chocolate Truffles",
    description: "Assorted chocolate truffles",
    price: 350,
    category: "chocolate",
    images: [{ url: "/images/trufflechoco.jpg", alt: "Chocolate Truffles" }],
    isEggless: true,
    stock: 30,
    tags: ["truffles", "chocolate"]
  },
  {
    name: "White Chocolate",
    description: "Premium white chocolate",
    price: 380,
    category: "chocolate",
    images: [{ url: "/images/whitechoco.jpeg", alt: "White Chocolate" }],
    isEggless: true,
    stock: 18,
    tags: ["white", "chocolate"]
  },

  // Best Sellers
  {
    name: "Chocolate Truffle Cake",
    description: "Rich chocolate cake with creamy truffle",
    price: 599,
    category: "bestseller",
    images: [{ url: "/images/chocotruffle.webp", alt: "Chocolate Truffle Cake" }],
    isEggless: true,
    isBestSeller: true,
    stock: 10,
    tags: ["chocolate", "truffle", "cake"]
  },
  {
    name: "Red Velvet Cake",
    description: "Classic red velvet with cream cheese",
    price: 699,
    category: "bestseller",
    images: [{ url: "/images/redvelvet.jpg", alt: "Red Velvet Cake" }],
    isEggless: false,
    isBestSeller: true,
    stock: 8,
    tags: ["red velvet", "cream cheese"]
  },
  {
    name: "Black Forest Cake",
    description: "Classic black forest with cherries",
    price: 799,
    category: "bestseller",
    images: [{ url: "/images/black-forest.jpeg", alt: "Black Forest Cake" }],
    isEggless: false,
    isBestSeller: true,
    stock: 5,
    tags: ["black forest", "cherries"]
  },
  {
    name: "Pineapple Cake",
    description: "Fresh pineapple cake with whipped cream",
    price: 549,
    category: "bestseller",
    images: [{ url: "/images/Pineapple-Cake.jpg", alt: "Pineapple Cake" }],
    isEggless: true,
    isBestSeller: true,
    stock: 12,
    tags: ["pineapple", "fruit", "cake"]
  },

  // Occasions
  {
    name: "Anniversary Cake",
    description: "Elegant cakes for your special milestones",
    price: 899,
    category: "occasion",
    images: [{ url: "/images/happyanniversary.png", alt: "Anniversary Cake" }],
    isEggless: false,
    stock: 10,
    tags: ["anniversary", "elegant"]
  },
  {
    name: "Wedding Cake",
    description: "Grand wedding cakes for your big day",
    price: 1999,
    category: "occasion",
    images: [{ url: "/images/wedding.jpg", alt: "Wedding Cake" }],
    isEggless: false,
    stock: 3,
    tags: ["wedding", "grand"]
  },
  {
    name: "Baby Shower Cake",
    description: "Adorable cakes for baby celebrations",
    price: 799,
    category: "occasion",
    images: [{ url: "/images/babyshower.jpg", alt: "Baby Shower Cake" }],
    isEggless: true,
    stock: 7,
    tags: ["baby shower", "adorable"]
  },
  {
    name: "Graduation Cake",
    description: "Celebrate academic achievements",
    price: 699,
    category: "occasion",
    images: [{ url: "/images/graduation.png", alt: "Graduation Cake" }],
    isEggless: false,
    stock: 6,
    tags: ["graduation", "academic"]
  },
  {
    name: "Festival Special Cake",
    description: "Special cakes for festivals",
    price: 599,
    category: "occasion",
    images: [{ url: "/images/festival-cake.png", alt: "Festival Special Cake" }],
    isEggless: true,
    stock: 15,
    tags: ["festival", "special"]
  },
  {
    name: "Corporate Cake",
    description: "Professional cakes for corporate events",
    price: 1299,
    category: "occasion",
    images: [{ url: "/images/corporate-cake.png", alt: "Corporate Cake" }],
    isEggless: false,
    stock: 4,
    tags: ["corporate", "professional"]
  }
];

const seedDatabase = async () => {
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

    // Show summary by category
    console.log('\n📊 Products by Category:');
    const categories = {};
    result.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    
    Object.keys(categories).forEach(category => {
      console.log(`   ${category}: ${categories[category]} products`);
    });

    // Show bestsellers
    const bestsellers = result.filter(product => product.isBestSeller);
    console.log(`\n⭐ Bestsellers: ${bestsellers.length} products`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n🚀 You can now start your application and the products will be available.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 TIP: Check your MongoDB username and password');
    } else if (error.message.includes('getaddrinfo')) {
      console.log('\n💡 TIP: Check your internet connection and MongoDB connection string');
    } else if (error.message.includes('validation')) {
      console.log('\n💡 TIP: Check your Product model schema validation');
    }
    
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();