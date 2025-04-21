const express = require('express');
const router = express.Router();
const { getProfile, getUserById } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware, getProfile);
router.get('/:userId', authMiddleware, getUserById);

module.exports = router;
