const Product = require("../models/productModel");

// ✅ CREATE PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body, addedBy: req.user._id });
    await product.save();
    res.status(201).json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL PRODUCTS (Includes Dynamic Status)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("addedBy", "email role");

    // Modify response to include computed status
    const productsWithStatus = products.map((product) => ({
      ...product.toObject(),
      status: product.status, // Computed dynamically
    }));

    res.json({ success: true, products: productsWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET SINGLE PRODUCT (Includes Dynamic Status)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("addedBy", "email role");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, product: { ...product.toObject(), status: product.status } });
  } catch (error) {
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
  
      // Send updated product with dynamic status
      res.json({ 
        success: true, 
        message: "Product updated successfully", 
        product: { ...product.toObject(), status: product.status }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  