const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

exports.createRoom = async (req, res) => {
  try {
    const { userIds, isGroupChat, name } = req.body;
    const participants = [...userIds, req.user.id];

    const room = await ChatRoom.create({ participants, isGroupChat, name });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create room' });
  }
};

exports.getRooms = async (req, res) => {
  try {
    // console.log(req);
    const rooms = await ChatRoom.find({ participants: req.user.id })
      .populate('participants', 'username email')
      .populate('lastMessage');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get rooms' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatRoomId: req.params.roomId })
      .populate('senderId', 'username');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndUpdate(messageId, { isSeen: true });
    res.status(200).json({ message: 'Marked as seen' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark message as seen' });
  }
};
