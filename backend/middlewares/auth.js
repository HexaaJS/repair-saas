const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { jwt: jwtConfig } = require('../config/env');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Accès non autorisé', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, jwtConfig.secret);

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new AppError('Utilisateur introuvable ou désactivé', 401);
  }

  req.user = user;
  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('Vous n\'avez pas les droits pour cette action', 403);
    }
    next();
  };
};

module.exports = { protect, authorize };