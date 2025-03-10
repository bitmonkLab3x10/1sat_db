const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
    gifUrl: { type: String, }, // ✅ Match the controller
    

    availableTime: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      duration: { type: Number, required: true },
    },
    availableShops: [
      {
        shopName: { type: String, required: true },
        location: { type: String, required: true },
        address: { type: String, required: true },
        latitude: { type: Number, required: true }, // ✅ Added latitude
        longitude: { type: Number, required: true }, // ✅ Added longitude
      },
    ],
    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
    },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// ✅ Virtual field for dynamic status
productSchema.virtual("status").get(function () {
  const now = new Date();
  if (now < this.availableTime.start) return "coming_soon";
  if (now >= this.availableTime.start && now <= this.availableTime.end) return "available";
  return "unavailable";
});

module.exports = mongoose.model("Product", productSchema);

