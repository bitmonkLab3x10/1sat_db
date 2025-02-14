const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  editProduct,
  deleteProduct,
} = require("../controllers/productController");

const { authenticateUser, checkRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/add", authenticateUser, checkRole(["admin", "client"]), addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/edit/:id", authenticateUser, checkRole(["admin", "client"]), editProduct);
router.delete("/delete/:id", authenticateUser, checkRole(["admin", "client"]), deleteProduct);

module.exports = router;
