const users = require('../models/usermodel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const randomBytes = require('randombytes')




// Set the fallback random number generator
bcrypt.setRandomFallback(randomBytes);

exports.register = async (req, res) => {  // ✅ Make sure this is async
    console.log("Inside register controller");

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const existingUser = await users.findOne({ email });  // ✅ Await inside async function
        if (existingUser) {
            return res.status(406).json({ error: "Account Already Exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new users({
            email,
            password: hashedPassword,
            profile: "Default Profile"
        });

        await newUser.save();  // ✅ Await inside async function

        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};






//login


exports.login = async (req, res) => {
    console.log('inside login controller');
    const { email, password } = req.body;
    console.log(email, password);

    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(406).json('Incorrect email or password');
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(406).json('Incorrect email or password');
        }

        // Generate a token
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


        // Response
        res.status(200).json({ existingUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json('Server error');
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
