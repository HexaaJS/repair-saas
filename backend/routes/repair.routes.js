const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createRepair,
  getRepairs,
  getRepair,
  updateRepair,
  updateStatus,
  trackRepair,
} = require('../controllers/repair.controller');

// Route publique (le client suit sa réparation sans login)
router.get('/track/:token', trackRepair);

// Routes protégées
router.use(protect);

router.route('/')
  .get(getRepairs)
  .post(createRepair);

router.route('/:id')
  .get(getRepair)
  .put(updateRepair);

router.patch('/:id/status', updateStatus);

module.exports = router;