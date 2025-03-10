const Purchase = require("../models/purchaseModel");
const Product = require("../models/productModel");

// ✅ CREATE A PURCHASE (First-Come-First-Serve)
exports.purchaseProduct = async (req, res) => {
  try {
    const { productId, quantity, paymentMethod, shippingAddress } = req.body;
    const userId = req.user._id;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Check if the product is already purchased (Unavailable)
    const existingPurchase = await Purchase.findOne({ productId });
    if (existingPurchase) return res.status(400).json({ success: false, message: "Product is already purchased" });

    // Check if the requested quantity is available
    if (quantity > product.count) return res.status(400).json({ success: false, message: "Not enough stock available" });

    // Calculate total price
    const totalPrice = quantity * product.price;

    // Create new purchase
    const purchase = new Purchase({
      productId,
      userId,
      purchaseDate: new Date(),
      quantity,
      totalPrice,
      paymentMethod,
      shippingAddress,
      status: "completed"
    });

    // Save purchase
    await purchase.save();

    // Decrease product count accordingly
    product.count -= quantity;
    if (product.count === 0) {
      product.status = "unavailable"; // Mark status as unavailable if out of stock
    }
    await product.save();

    res.status(201).json({
      success: true,
      message: "Payment successful. Product purchased!",
      purchase
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ GET USER PURCHASE HISTORY
exports.getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user._id }).populate("productId");
    res.json({ success: true, purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
