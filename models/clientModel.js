// models/Client.js

const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  website: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  alternatePhone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['client'],
    default: 'client',
    immutable: true, // Ensures the role cannot be changed
  },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
