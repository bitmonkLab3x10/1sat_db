const express = require('express');
const router = express.Router();
const {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

// Corrected routes (Remove extra "/clients")
router.post('/', createClient);  // POST /clients
router.get('/', getClients);  // GET /clients
router.get('/:id', getClient);  // GET /clients/:id
router.put('/:id', updateClient);  // PUT /clients/:id
router.delete('/:id', deleteClient);  // DELETE /clients/:id

module.exports = router;
