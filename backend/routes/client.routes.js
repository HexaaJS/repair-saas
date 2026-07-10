const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createClient,
  getClients,
  getClient,
  updateClient,
  searchClients,
} = require('../controllers/client.controller');

router.use(protect);

router.get('/search', searchClients);

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .get(getClient)
  .put(updateClient);

module.exports = router;