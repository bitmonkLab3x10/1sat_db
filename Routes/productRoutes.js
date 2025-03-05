const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  editProduct,
  deleteProduct,
} = require("../controllers/productController");
const { authenticateUser, checkRole } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerConfig"); // ✅ Import Multer middleware

const router = express.Router();

// ✅ Updated Route to Handle File Upload
router.post("/add", authenticateUser, checkRole(["admin", "client"]), upload.single("gif"), addProduct);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/edit/:id", authenticateUser, checkRole(["admin", "client"]), upload.single("gif"), editProduct);
router.delete("/delete/:id", authenticateUser, checkRole(["admin", "client"]), deleteProduct);

module.exports = router;


