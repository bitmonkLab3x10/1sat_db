const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to product
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to end-user
    purchaseDate: { type: Date, required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    paymentMethod: { type: String, required: true },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
