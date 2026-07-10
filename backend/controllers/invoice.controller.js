const Invoice = require('../models/Invoice');
const Repair = require('../models/Repair');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');

// POST /api/invoices
const createInvoice = asyncHandler(async (req, res) => {
  const { repairId, items, notes, paymentMethod } = req.body;

  if (!repairId || !items || items.length === 0) {
    throw new AppError('La réparation et au moins une ligne sont requises', 400);
  }

  const repair = await Repair.findById(repairId);

  if (!repair) {
    throw new AppError('Réparation non trouvée', 404);
  }

  // Vérifier qu'il n'y a pas déjà une facture pour cette réparation
  const existing = await Invoice.findOne({ repair: repairId });
  if (existing) {
    throw new AppError('Une facture existe déjà pour cette réparation', 400);
  }

  const invoice = await Invoice.create({
    repair: repairId,
    client: repair.client,
    shop: repair.shop,
    items,
    notes,
    paymentMethod,
  });

  // Mettre à jour le prix final de la réparation
  repair.finalPrice = invoice.totalTTC;
  await repair.save();

  sendResponse(res, 201, { invoice }, 'Facture créée avec succès');
});

// GET /api/invoices
const getInvoices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isPaid } = req.query;

  const filter = { shop: req.user.shop };
  if (isPaid !== undefined) filter.isPaid = isPaid === 'true';

  // Admin voit toutes ses boutiques
  if (req.user.role === 'admin') {
    const Shop = require('../models/Shop');
    const shops = await Shop.find({ owner: req.user._id }).select('_id');
    filter.shop = { $in: shops.map((s) => s._id) };
  }

  const invoices = await Invoice.find(filter)
    .populate('client', 'firstName lastName phone')
    .populate('repair', 'reference device')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Invoice.countDocuments(filter);

  sendResponse(res, 200, { invoices, total, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/invoices/:id
const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('client')
    .populate('repair', 'reference device problemDescription')
    .populate('shop');

  if (!invoice) {
    throw new AppError('Facture non trouvée', 404);
  }

  sendResponse(res, 200, { invoice });
});

// PATCH /api/invoices/:id/pay
const markAsPaid = asyncHandler(async (req, res) => {
  const { paymentMethod } = req.body;

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new AppError('Facture non trouvée', 404);
  }

  if (invoice.isPaid) {
    throw new AppError('Cette facture est déjà payée', 400);
  }

  invoice.isPaid = true;
  invoice.paidAt = new Date();
  if (paymentMethod) invoice.paymentMethod = paymentMethod;
  await invoice.save();

  // Mettre à jour la réparation
  const repair = await Repair.findById(invoice.repair);
  if (repair) {
    repair.isPaid = true;
    await repair.save();
  }

  sendResponse(res, 200, { invoice }, 'Facture marquée comme payée');
});

// PUT /api/invoices/:id
const updateInvoice = asyncHandler(async (req, res) => {
  const { items, notes, paymentMethod } = req.body;

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new AppError('Facture non trouvée', 404);
  }

  if (invoice.isPaid) {
    throw new AppError('Impossible de modifier une facture payée', 400);
  }

  if (items) invoice.items = items;
  if (notes !== undefined) invoice.notes = notes;
  if (paymentMethod) invoice.paymentMethod = paymentMethod;

  await invoice.save();

  // Mettre à jour le prix de la réparation
  const repair = await Repair.findById(invoice.repair);
  if (repair) {
    repair.finalPrice = invoice.totalTTC;
    await repair.save();
  }

  sendResponse(res, 200, { invoice }, 'Facture mise à jour');
});

// DELETE /api/invoices/:id
const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new AppError('Facture non trouvée', 404);
  }

  // Remettre le prix à 0 sur la réparation
  const repair = await Repair.findById(invoice.repair);
  if (repair) {
    repair.finalPrice = 0;
    repair.isPaid = false;
    await repair.save();
  }

  await Invoice.findByIdAndDelete(req.params.id);

  sendResponse(res, 200, null, 'Facture supprimée');
});

module.exports = { createInvoice, getInvoices, getInvoice, updateInvoice, deleteInvoice, markAsPaid };