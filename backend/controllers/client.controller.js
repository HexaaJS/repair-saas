const Client = require('../models/Client');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');

// POST /api/clients
const createClient = asyncHandler(async (req, res) => {
  req.body.shop = req.user.shop;

  const client = await Client.create(req.body);

  sendResponse(res, 201, { client }, 'Client créé avec succès');
});

// GET /api/clients
const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ shop: req.user.shop })
    .sort({ createdAt: -1 });

  sendResponse(res, 200, { clients });
});

// GET /api/clients/:id
const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    throw new AppError('Client non trouvé', 404);
  }

  sendResponse(res, 200, { client });
});

// PUT /api/clients/:id
const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!client) {
    throw new AppError('Client non trouvé', 404);
  }

  sendResponse(res, 200, { client }, 'Client mis à jour');
});

// GET /api/clients/search?q=dupont
const searchClients = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new AppError('Le paramètre de recherche est requis', 400);
  }

  const regex = new RegExp(q, 'i');

  const clients = await Client.find({
    shop: req.user.shop,
    $or: [
      { firstName: regex },
      { lastName: regex },
      { phone: regex },
      { email: regex },
    ],
  });

  sendResponse(res, 200, { clients });
});

module.exports = { createClient, getClients, getClient, updateClient, searchClients };