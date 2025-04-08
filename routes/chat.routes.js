const express = require('express');
const { createRoom, getRooms, getMessages } = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/room', authMiddleware, createRoom);
router.get('/rooms', authMiddleware, getRooms);
router.get('/messages/:roomId', authMiddleware, getMessages);
router.put('/seen/:messageId', authMiddleware, markAsSeen);


module.exports = router;
