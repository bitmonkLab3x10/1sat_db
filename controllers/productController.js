const Product = require("../models/productModel");
const fs = require("fs");
const path = require("path");


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
    product.gifUrl = `/uploads/${req.file.filename}`;
    await product.save();

    res.json({ success: true, message: "GIF uploaded successfully", gifUrl: product.gifUrl });
  } catch (error) {
    console.error("Error uploading GIF:", error);
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
      gifUrl: product.gifUrl ? `/uploads/${product.gifUrl.replace(/^.*[\\\/]/, '')}` : null, // FIXED: Use gifUrl instead of gif
    }));

    res.json({ success: true, products: productsWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET SINGLE PRODUCT (Includes Dynamic Status)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ✅ Format `gifUrl` properly
    const productWithGif = {
      ...product.toObject(),
      gifUrl: product.gif ? `/uploads/${product.gif}` : null, // Ensure correct path
    };

    res.json({ success: true, product: productWithGif });
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

    // Send updated product with dynamic status
    res.json({ 
      success: true, 
      message: "Product updated successfully", 
      product: { ...product.toObject(), status: product.status, gifUrl: product.gif ? `/uploads/${product.gif}` : null }
    });
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
    if (product.gif) {
      const gifPath = path.join(__dirname, "../uploads", product.gif);
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
