const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, required: true }, // Quantity available
    availableTime: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      duration: { type: Number, required: true }, // Duration in hours
    },
    availableShops: [
      {
        shopName: { type: String, required: true },
        location: { type: String, required: true },
        address: { type: String, required: true },
      },
    ],
    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
    },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to client user
    status: { type: String, enum: ["available", "coming_soon"], default: "coming_soon" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
