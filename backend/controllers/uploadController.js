import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Upload an image and store in MongoDB
// @route   POST /api/upload
// @access  Public
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const imageBuffer = req.file.buffer; // Store binary data

  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    brand: req.body.brand,
    category: req.body.category,
    image: imageBuffer, // Save image directly in DB
  });

  const savedProduct = await newProduct.save();
  res.status(201).json(savedProduct);
});

export { uploadImage };
