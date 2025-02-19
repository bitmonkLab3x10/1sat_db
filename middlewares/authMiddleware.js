const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// ✅ Middleware to Authenticate User
const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ success: false, message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    
    if (!req.user) return res.status(401).json({ success: false, message: "Invalid token." });

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token." });
  }
};

// ✅ Middleware to Check User Role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports = { authenticateUser, checkRole };
