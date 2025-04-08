const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware, getProfile);

module.exports = router;
