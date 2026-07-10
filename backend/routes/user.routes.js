const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getTeam,
  addMember,
  updateMember,
  removeMember,
  updateProfile,
} = require('../controllers/user.controller');

router.use(protect);

router.put('/profile', updateProfile);

router.get('/team', authorize('admin', 'manager'), getTeam);
router.post('/team', authorize('admin'), addMember);
router.put('/team/:id', authorize('admin'), updateMember);
router.delete('/team/:id', authorize('admin'), removeMember);

module.exports = router;