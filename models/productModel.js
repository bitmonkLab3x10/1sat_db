const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    count: { type: Number, required: true, min: 0 },

    gifUrl: { type: String, validate: /^https?:\/\/.+/ },

    availableTime: {
      start: { type: Date, required: true },
      end: {
        type: Date,
        required: true,
        validate: {
          validator: function (value) {
            return value > this.availableTime.start;
          },
          message: "End time must be after start time!",
        },
      },
    },

    // ✅ Replace `availableShops` with single `shop`
    shop: {
      shopName: { type: String, required: true },
      location: { type: String, required: true },
      address: { type: String, required: true },
      latitude: { type: Number, required: true, min: -90, max: 90 },
      longitude: { type: Number, required: true, min: -180, max: 180 },
    },

    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
    },

    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ✅ Virtual for status
productSchema.virtual("status").get(function () {
  const now = new Date();
  if (now < this.availableTime.start) return "coming_soon";
  if (now >= this.availableTime.start && now <= this.availableTime.end) return "available";
  return "unavailable";
});

// ✅ Virtual for duration in seconds
productSchema.virtual("availableTime.duration").get(function () {
  return (this.availableTime.end - this.availableTime.start) / 1000;
});

module.exports = mongoose.model("Product", productSchema);
