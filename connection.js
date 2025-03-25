const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectionString = process.env.DATABASE;

if (!connectionString) {
    console.error("MongoDB URI is missing. Check your .env file.");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error(`MongoDB connection failed due to ${err}`));
