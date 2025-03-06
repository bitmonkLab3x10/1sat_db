const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    role: { type: String, enum: ["common", "client", "admin"], default: "common" },
    profile: {
      firstName: { type: String },
      lastName: { type: String },
      phone: { type: String},
      country: { type: String, default: "" },
      address: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Prevent Overwrite Error
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
