const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join chat room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`📥 Joined room: ${roomId}`);
    });

    // Send message
    socket.on('send_message', async (data) => {
      const { chatRoomId, senderId, message, messageType = 'text' } = data;

      try {
        const newMessage = await Message.create({
          chatRoomId,
          senderId,
          message,
          messageType
        });

        // Update last message in chat room
        await ChatRoom.findByIdAndUpdate(chatRoomId, {
          lastMessage: newMessage._id
        });

        const populatedMsg = await newMessage.populate('senderId', 'username');
        
        // Emit to all in room
        io.to(chatRoomId).emit('receive_message', populatedMsg);
        
      } catch (err) {
        console.error('❌ Error sending message:', err.message);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
