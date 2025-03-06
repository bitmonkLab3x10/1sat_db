const users = require('../models/usermodel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const randomBytes = require('randombytes')




// Set the fallback random number generator
bcrypt.setRandomFallback(randomBytes);

exports.register = async (req, res) => {
    console.log('inside register controller');
    const { email, password, profile } = req.body;
    console.log(email, password, profile);

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(406).json('Account Already Exists');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new users({
            email,
            password: hashedPassword,  // Use the hashed password here
            profile
        });

        // Save the user to the database
        await newUser.save();

        // Generate a token
        const token = jwt.sign({ userId: newUser._id }, 'secretkey');

        // Response
        res.status(201).json({ newUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json('Server error');
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

