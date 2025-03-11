const Product = require("../models/productModel");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/usermodel");

// ✅ ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    console.log("Request file:", req.file); // Debugging

    let gifUrl = "";
    if (req.file) {
      gifUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`; // ✅ Full URL
    }

    const product = new Product({
      ...req.body,
      addedBy: req.user._id,
      gifUrl, // ✅ Store complete URL
    });

    await product.save();
    res.status(201).json({ success: true, message: "Product added successfully", product });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPLOAD GIF FOR PRODUCT
exports.uploadProductGif = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Only allow "admin" or "client" to upload GIFs
    if (req.user.role !== "admin" && req.user.role !== "client") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No GIF file uploaded" });
    }

    console.log("Uploaded File:", req.file); // Debugging

    // Delete old GIF if it exists
    if (product.gifUrl) {
      const oldGifPath = path.join(__dirname, "../uploads", path.basename(product.gifUrl));
      if (fs.existsSync(oldGifPath)) {
        fs.unlinkSync(oldGifPath);
      }
    }

    // Save the new GIF URL
    product.gifUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    await product.save();

    res.json({ success: true, message: "GIF uploaded successfully", gifUrl: product.gifUrl });
  } catch (error) {
    console.error("Error uploading GIF:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("addedBy", "email role");

    // Modify response to include computed status
    const productsWithStatus = products.map((product) => ({
      ...product.toObject(),
      gifUrl: product.gifUrl ? product.gifUrl : null, // ✅ Ensure correct `gifUrl`
    }));

    res.json({ success: true, products: productsWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE PRODUCT
exports.editProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Only allow "admin" or "client" to update
    if (req.user.role !== "admin" && req.user.role !== "client") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    // Update product fields
    Object.assign(product, req.body);
    await product.save();

    res.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Only allow "admin" or "client" to delete
    if (req.user.role !== "admin" && req.user.role !== "client") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    // Delete GIF file if exists
    if (product.gifUrl) {
      const gifPath = path.join(__dirname, "../uploads", path.basename(product.gifUrl));
      if (fs.existsSync(gifPath)) {
        fs.unlinkSync(gifPath);
      }
    }

    await product.deleteOne();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET PRODUCTS BY USER
exports.getProductsByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // MongoDB _id of user

    // Validate if it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find products added by this user
    const products = await Product.find({ addedBy: userId }).populate("addedBy", "email role");

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found for this user" });
    }

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
