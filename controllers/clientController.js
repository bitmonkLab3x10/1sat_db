// controllers/clientController.js

const Client = require('../models/clientModel');

// Create a new client
const createClient = async (req, res) => {
  try {
    const { email, website, phone, alternatePhone } = req.body;

    const newClient = new Client({
      email,
      website,
      phone,
      alternatePhone,
    });

    await newClient.save();
    res.status(201).json({ message: 'Client created successfully', client: newClient });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single client by ID
const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a client by ID (Prevent role modification)
const updateClient = async (req, res) => {
  try {
    const { role, ...updateData } = req.body; // Ensure role is not updated

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(200).json({ message: 'Client updated successfully', client: updatedClient });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a client by ID
const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
};
