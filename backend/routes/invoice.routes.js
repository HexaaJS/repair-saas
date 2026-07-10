const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  createInvoice,
  getInvoices,
  getInvoice,
  markAsPaid,
  updateInvoice,
  deleteInvoice,
} = require('../controllers/invoice.controller');

router.use(protect);

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.get('/:id', getInvoice);
router.patch('/:id/pay', markAsPaid);
router.put('/:id', updateInvoice);
router.delete('/:id', authorize('admin', 'manager'), deleteInvoice);

module.exports = router;