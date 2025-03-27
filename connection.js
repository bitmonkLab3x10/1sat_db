// const mongoose = require('mongoose');
// require('dotenv').config(); // Load environment variables

// const connectionString = process.env.DATABASE;

// if (!connectionString) {
//     console.error("MongoDB URI is missing. Check your .env file.");
//     process.exit(1);
// }

// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected successfully'))
// .catch(err => console.error(`MongoDB connection failed due to ${err}`));

const mongoose = require('mongoose');
require('dotenv').config(); // Only needed for local development

// Debug: Log the environment variables
console.log("Environment Variables:", {
  MONGODB_URI: process.env.MONGODB_URI,  // Removed added URL  and below changed Connection String
  // DATABASE: process.env.DATABASE
});

 const connectionString = process.env.MONGODB_URI; // Changed from DATABASE to MONGODB_URI
// const connectionString = process.env.DATABASE;

if (!connectionString) {
    console.error("MongoDB URI is missing. Check your environment variables.");
    process.exit(1);
}

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
    console.error('MongoDB connection failed:');
    console.error(err);
    process.exit(1); // Exit if DB connection fails
});
