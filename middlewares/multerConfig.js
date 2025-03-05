const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define the uploads directory
const uploadDir = path.join(__dirname, "../uploads");

// ✅ Ensure the "uploads" folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// File filter to accept only GIF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/gif") {
    cb(null, true);
  } else {
    cb(new Error("Only GIF files are allowed!"), false);
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // Max file size: 5MB
});

module.exports = upload;
