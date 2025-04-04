const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ✅ Cloudinary config (values should be in your .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Optional: your Cloudinary folder name
    allowed_formats: ["gif"], // Only allow GIFs
    public_id: (req, file) => Date.now().toString(), // Unique filename
  },
});

// ✅ File filter (redundant here but keeps your logic)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/gif") {
    cb(null, true);
  } else {
    cb(new Error("Only GIF files are allowed!"), false);
  }
};

// ✅ Multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

module.exports = upload;
