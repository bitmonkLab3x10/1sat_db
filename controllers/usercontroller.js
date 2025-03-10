const users = require('../models/usermodel');

const jwt = require('jsonwebtoken');
=======
const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs');

// User Registration
exports.register = async (req, res) => {
    console.log("Inside register controller");

    const { email, password, role = "user" } = req.body;

exports.register = async (req, res) => {  // ✅ Make sure this is async
    console.log("Inside register controller");

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const existingUser = await users.findOne({ email });  // ✅ Await inside async function
        if (existingUser) {

            return res.status(409).json({ error: "Account already exists" });

            return res.status(406).json({ error: "Account Already Exists" });

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

            profile: "Default Profile"
        });

        await newUser.save();  // ✅ Await inside async function


        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// User Login






//login



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

        // Generate a token
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });



        res.status(201).json({ message: "User added successfully", user: newUser });
    } catch (error) {
        console.error("Add User Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.addUser = async (req, res) => {
    console.log("inside addUser controller");

    const { email, password, role, profile } = req.body;

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(406).json("Account Already Exists");
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new users({
            email,
            password: hashedPassword, // Store the hashed password
            role: role || "common", // Default role to 'common' if not provided
            profile
        });

        // Save user to DB
        await newUser.save();

        res.status(201).json({ message: "User added successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error");
    }
};

