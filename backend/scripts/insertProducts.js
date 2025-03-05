import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/productModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import required for ES module workaround

dotenv.config();

// Define __dirname manually (Fix for ES module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert image to Base64
const encodeImageToBase64 = (filePath) => {
  const imageBuffer = fs.readFileSync(filePath);
  return `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
};

// Convert images to Base64 format
const freshApples = encodeImageToBase64(
  path.join(__dirname, "../utils/images/FreshApples.jpg")
);
const wholeWheatBread = encodeImageToBase64(
  path.join(__dirname, "../utils/images/WholeWheatBread.jpg")
);
const organicMilk = encodeImageToBase64(
  path.join(__dirname, "../utils/images/OrganicMilk.jpg")
);
const brownEggs = encodeImageToBase64(
  path.join(__dirname, "../utils/images/BrownEggs.jpg")
);
const basmatiRice = encodeImageToBase64(
  path.join(__dirname, "../utils/images/BasmatiRice.jpg")
);

// Sample product data
const products = [
  {
    name: "Fresh Apples",
    description: "Crisp and juicy red apples, perfect for snacking.",
    price: 3.99,
    brand: "Farm Fresh",
    category: "Fruits",
    image: freshApples, // 🔥 Store as Base64 string
    rating: 4.8,
    numReviews: 15,
    countInStock: 10,
  },
  {
    name: "Whole Wheat Bread",
    description: "Healthy and nutritious whole wheat bread.",
    price: 2.49,
    brand: "Bakers Delight",
    category: "Bakery",
    image: wholeWheatBread,
    rating: 4.7,
    numReviews: 12,
    countInStock: 20,
  },
  {
    name: "Organic Milk",
    description: "Pure and fresh organic milk rich in nutrients.",
    price: 4.99,
    brand: "Dairy Pure",
    category: "Dairy",
    image: organicMilk,
    rating: 4.9,
    numReviews: 20,
    countInStock: 35,
  },
  {
    name: "Brown Eggs (12 Pack)",
    description: "Farm-fresh brown eggs packed with protein.",
    price: 5.99,
    brand: "Golden Farms",
    category: "Dairy",
    image: brownEggs,
    rating: 4.6,
    numReviews: 18,
    countInStock: 75,
  },
  {
    name: "Basmati Rice (5kg)",
    description: "Premium quality Basmati rice for fluffy and aromatic meals.",
    price: 12.99,
    brand: "Royal Harvest",
    category: "Grains",
    image: basmatiRice,
    rating: 4.5,
    numReviews: 22,
    countInStock: 43,
  },
];

// Insert products into MongoDB
const insertProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(products);
    console.log("✅ Grocery products inserted successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error inserting products:", error);
    mongoose.connection.close();
  }
};

insertProducts();
