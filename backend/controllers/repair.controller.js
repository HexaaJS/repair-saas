const Repair = require('../models/Repair');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');

// POST /api/repairs
const createRepair = asyncHandler(async (req, res) => {
  req.body.shop = req.user.shop;
  req.body.technician = req.user._id;

  const repair = await Repair.create(req.body);

  sendResponse(res, 201, { repair }, 'Réparation créée avec succès');
});

// GET /api/repairs
const getRepairs = asyncHandler(async (req, res) => {
  const { status, technician, page = 1, limit = 20 } = req.query;

  const filter = { shop: req.user.shop };

  if (status) filter.status = status;
  if (technician) filter.technician = technician;

  const repairs = await Repair.find(filter)
    .populate('client', 'firstName lastName phone')
    .populate('technician', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Repair.countDocuments(filter);

  sendResponse(res, 200, { repairs, total, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/repairs/:id
const getRepair = asyncHandler(async (req, res) => {
  const repair = await Repair.findById(req.params.id)
    .populate('client')
    .populate('technician', 'firstName lastName')
    .populate('shop', 'name phone');

  if (!repair) {
    throw new AppError('Réparation non trouvée', 404);
  }

  sendResponse(res, 200, { repair });
});

// PUT /api/repairs/:id
const updateRepair = asyncHandler(async (req, res) => {
  const repair = await Repair.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!repair) {
    throw new AppError('Réparation non trouvée', 404);
  }

  sendResponse(res, 200, { repair }, 'Réparation mise à jour');
});

// PATCH /api/repairs/:id/status
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    throw new AppError('Le statut est requis', 400);
  }

  const repair = await Repair.findById(req.params.id);

  if (!repair) {
    throw new AppError('Réparation non trouvée', 404);
  }

  repair.status = status;

  if (status === 'termine') repair.completedAt = new Date();
  if (status === 'restitue') repair.returnedAt = new Date();

  await repair.save();

  sendResponse(res, 200, { repair }, `Statut mis à jour : ${status}`);
});

// GET /api/repairs/track/:token (public)
const trackRepair = asyncHandler(async (req, res) => {
  const repair = await Repair.findOne({ trackingToken: req.params.token })
    .select('reference status device problemDescription estimatedPrice estimatedEndDate createdAt')
    .populate('shop', 'name phone');

  if (!repair) {
    throw new AppError('Réparation non trouvée', 404);
  }

  sendResponse(res, 200, { repair });
});

module.exports = { createRepair, getRepairs, getRepair, updateRepair, updateStatus, trackRepair };