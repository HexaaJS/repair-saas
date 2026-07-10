const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');

// PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;

  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) {
      throw new AppError('Cet email est déjà utilisé', 400);
    }
    user.email = email;
  }

  if (password) {
    user.password = password;
  }

  await user.save();

  user.password = undefined;

  sendResponse(res, 200, { user }, 'Profil mis à jour');
});

// GET /api/users/team
const getTeam = asyncHandler(async (req, res) => {
  let filter;

  if (req.user.role === 'admin') {
    const Shop = require('../models/Shop');
    const shops = await Shop.find({ owner: req.user._id }).select('_id');
    const shopIds = shops.map((s) => s._id);
    filter = { shop: { $in: shopIds }, _id: { $ne: req.user._id } };
  } else {
    filter = { shop: req.user.shop, _id: { $ne: req.user._id } };
  }

  const members = await User.find(filter).populate('shop', 'name');

  sendResponse(res, 200, { members });
});

// POST /api/users/team
const addMember = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, shop } = req.body;

  if (!firstName || !lastName || !email || !password || !shop) {
    throw new AppError('Tous les champs sont requis', 400);
  }

  if (role === 'admin') {
    throw new AppError('Impossible de créer un autre admin', 403);
  }

  const exists = await User.findOne({ email });
  if (exists) {
    throw new AppError('Cet email est déjà utilisé', 400);
  }

  const member = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'technicien',
    shop,
  });

  member.password = undefined;

  sendResponse(res, 201, { member }, 'Membre ajouté avec succès');
});

// PUT /api/users/team/:id
const updateMember = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, role, shop, isActive } = req.body;

  const member = await User.findById(req.params.id);

  if (!member) {
    throw new AppError('Membre non trouvé', 404);
  }

  if (member._id.equals(req.user._id)) {
    throw new AppError('Utilisez la route profil pour vous modifier', 400);
  }

  if (firstName) member.firstName = firstName;
  if (lastName) member.lastName = lastName;
  if (email) member.email = email;
  if (role && role !== 'admin') member.role = role;
  if (shop) member.shop = shop;
  if (typeof isActive === 'boolean') member.isActive = isActive;

  await member.save();

  sendResponse(res, 200, { member }, 'Membre mis à jour');
});

// DELETE /api/users/team/:id
const removeMember = asyncHandler(async (req, res) => {
  const member = await User.findById(req.params.id);

  if (!member) {
    throw new AppError('Membre non trouvé', 404);
  }

  if (member._id.equals(req.user._id)) {
    throw new AppError('Vous ne pouvez pas vous supprimer', 400);
  }

  member.isActive = false;
  await member.save();

  sendResponse(res, 200, null, 'Membre désactivé');
});

module.exports = { getTeam, addMember, updateMember, removeMember, updateProfile };