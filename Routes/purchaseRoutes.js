const express = require("express");
const { purchaseProduct, getUserPurchases } = require("../controllers/purchaseController");

const { authenticateUser, checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

// Purchase a product (First-Come-First-Serve)
router.post("/",authenticateUser, purchaseProduct);  // Correct function reference, not an object


// Get user's purchase history
router.get("/", authenticateUser, getUserPurchases);

module.exports = router;
