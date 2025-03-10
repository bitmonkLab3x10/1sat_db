const users = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User Registration
exports.register = async (req, res) => {
    console.log("Inside register controller");

    const { email, password, role = "user" } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new users({
            email,
            password: hashedPassword,
            role, // Default role is 'user'
            profile: "Default Profile"
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// User Login
exports.login = async (req, res) => {
    console.log('Inside login controller');
    const { email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ error: "Incorrect email or password" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect email or password" });
        }

        // Generate JWT token with role
        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send token as HTTP-only cookie for security
        res.cookie("token", token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({ message: "Login successful", user: existingUser, token, role: existingUser.role });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Add User (Admin Feature)
exports.addUser = async (req, res) => {
    console.log("Inside addUser controller");

    const { email, password, role = "user", profile } = req.body;

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new users({
            email,
            password: hashedPassword,
            role, // Default role is 'user'
            profile: profile || "Default Profile"
        });

        await newUser.save();

        res.status(201).json({ message: "User added successfully", user: newUser });
    } catch (error) {
        console.error("Add User Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
