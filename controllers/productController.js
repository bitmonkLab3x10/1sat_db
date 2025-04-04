const Product = require("../models/productModel");
const mongoose = require("mongoose");
const User = require("../models/usermodel");

// ✅ ADD PRODUCT (Cloudinary-based)
exports.addProduct = async (req, res) => {
  try {
    console.log("Uploaded file:", req.file); // Debug

    let gifUrl = "";
    if (req.file && req.file.path) {
      gifUrl = req.file.path; // Cloudinary returns full URL
    }

    const product = new Product({
      ...req.body,
      addedBy: req.user._id,
      gifUrl,
    });

    await product.save();
    res.status(201).json({ success: true, message: "Product added successfully", product });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("addedBy", "email role");

    const productsWithStatus = products.map((product) => ({
      ...product.toObject(),
      gifUrl: product.gifUrl || null,
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

// ✅ EDIT PRODUCT (with optional GIF update via Cloudinary)
exports.editProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (req.user.role !== "admin" && req.user.role !== "client") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    Object.assign(product, req.body);

    if (req.file && req.file.path) {
      product.gifUrl = req.file.path; // Cloudinary URL
    }

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

    if (req.user.role !== "admin" && req.user.role !== "client") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    // 🔁 Optional: delete file from Cloudinary if you're storing public_id

    await product.deleteOne();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET PRODUCTS BY USER
exports.getProductsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const products = await Product.find({ addedBy: userId }).populate("addedBy", "email role");

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found for this user" });
    }

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
