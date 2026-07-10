const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Shop = require('../models/Shop');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { jwt: jwtConfig } = require('../config/env');

const generateToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, { expiresIn: jwtConfig.expire });
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, shopName } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new AppError('Cet email est déjà utilisé', 400);
  }

  // Créer le user admin
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: 'admin',
  });

  // Créer sa première boutique
  const shop = await Shop.create({
    name: shopName,
    owner: user._id,
  });

  // Rattacher la boutique au user
  user.shop = shop._id;
  await user.save();

  const token = generateToken(user._id);

  sendResponse(res, 201, { token, user, shop }, 'Compte créé avec succès');
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email et mot de passe requis', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Identifiants incorrects', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Identifiants incorrects', 401);
  }

  if (!user.isActive) {
    throw new AppError('Compte désactivé', 403);
  }

  const token = generateToken(user._id);

  user.password = undefined;

  sendResponse(res, 200, { token, user }, 'Connexion réussie');
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('shop');
  sendResponse(res, 200, { user });
});

module.exports = { register, login, getMe };