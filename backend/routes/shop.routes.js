const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  createShop,
  getShops,
  getShop,
  updateShop,
  deleteShop,
} = require('../controllers/shop.controller');

router.use(protect);

router.route('/')
  .get(getShops)
  .post(authorize('admin'), createShop);

router.route('/:id')
  .get(getShop)
  .put(authorize('admin', 'manager'), updateShop)
  .delete(authorize('admin'), deleteShop);

module.exports = router;