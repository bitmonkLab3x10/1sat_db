const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  getProductById,
  editProduct,
  deleteProduct,
  getProductsByUser,
} = require("../controllers/productController");

const { authenticateUser, checkRole } = require("../middlewares/authMiddleware");

// ✅ Import Multer config (Cloudinary version)
const upload = require("../middlewares/multerConfig"); // Adjust path if your file is named differently

// ✅ Add product with GIF upload
router.post(
  "/add",
  authenticateUser,
  checkRole(["admin", "client"]),
  upload.single("gif"), // Field name must be "gif" in frontend form
  addProduct
);

// ✅ Get all products (public)
router.get("/", getProducts);

// ✅ Get product by ID
router.get("/:id", getProductById);

// ✅ Edit product with optional new GIF
router.put(
  "/edit/:id",
  authenticateUser,
  checkRole(["admin", "client"]),
  upload.single("gif"), // Optional: if new GIF uploaded
  editProduct
);

// ✅ Delete a product
router.delete(
  "/delete/:id",
  authenticateUser,
  checkRole(["admin", "client"]),
  deleteProduct
);

// ✅ Get products by user
router.get("/user/:userId", getProductsByUser);

module.exports = router;
