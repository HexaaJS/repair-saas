const Shop = require('../models/Shop');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');

// POST /api/shops
const createShop = asyncHandler(async (req, res) => {
  req.body.owner = req.user._id;

  const shop = await Shop.create(req.body);

  sendResponse(res, 201, { shop }, 'Boutique créée avec succès');
});

// GET /api/shops
const getShops = asyncHandler(async (req, res) => {
  let shops;

  if (req.user.role === 'admin') {
    shops = await Shop.find({ owner: req.user._id });
  } else {
    shops = await Shop.find({ _id: req.user.shop });
  }

  sendResponse(res, 200, { shops });
});

// GET /api/shops/:id
const getShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    throw new AppError('Boutique non trouvée', 404);
  }

  sendResponse(res, 200, { shop });
});

// PUT /api/shops/:id
const updateShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!shop) {
    throw new AppError('Boutique non trouvée', 404);
  }

  sendResponse(res, 200, { shop }, 'Boutique mise à jour');
});

// DELETE /api/shops/:id
const deleteShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    throw new AppError('Boutique non trouvée', 404);
  }

  shop.isActive = false;
  await shop.save();

  sendResponse(res, 200, null, 'Boutique désactivée');
});

module.exports = { createShop, getShops, getShop, updateShop, deleteShop };