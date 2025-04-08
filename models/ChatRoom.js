const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isGroupChat: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
