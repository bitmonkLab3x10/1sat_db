const express = require("express");
const {
  addFAQ,
  getFAQs,
  getFAQById,
  editFAQ,
  deleteFAQ,
} = require("../controllers/faqController");

const router = express.Router();

// ✅ Routes for FAQs
router.post("/add", addFAQ);
router.get("/", getFAQs);
router.get("/:id", getFAQById);
router.put("/edit/:id", editFAQ);
router.delete("/delete/:id", deleteFAQ);

module.exports = router;