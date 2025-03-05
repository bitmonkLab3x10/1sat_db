const FAQ = require("../models/faqModel");

// ✅ Create FAQ
exports.addFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    // Check if FAQ already exists
    const existingFAQ = await FAQ.findOne({ question });
    if (existingFAQ) {
      return res.status(400).json({ success: false, message: "FAQ already exists" });
    }

    const faq = new FAQ({ question, answer });
    await faq.save();

    res.status(201).json({ success: true, message: "FAQ added successfully", faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single FAQ by ID
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });

    res.json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update FAQ
exports.editFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });

    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;
    await faq.save();

    res.json({ success: true, message: "FAQ updated successfully", faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });

    await faq.deleteOne();
    res.json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
