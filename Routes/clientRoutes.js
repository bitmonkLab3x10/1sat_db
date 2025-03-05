// routes/clientRoutes.js

const express = require('express');
const router = express.Router();
const {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

router.post('/clients', createClient);
router.get('/clients', getClients);
router.get('/clients/:id', getClient);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);

module.exports = router;
