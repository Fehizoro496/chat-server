require('dotenv').config();
// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const ChatRoom = require('./models/ChatRoom');
const Message = require('./models/Message');

const connectDB = require('./config/db');

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await ChatRoom.deleteMany();
    await Message.deleteMany();

    // Create Users
    const hashedPassword = await bcrypt.hash('12345678', 10);

    const users = await User.insertMany([
      { username: 'Pasteur', email: 'pasteur@example.com', password: hashedPassword },
      { username: 'Tonia', email: 'tonia@example.com', password: hashedPassword },
      { username: 'Tech', email: 'tech@example.com', password: hashedPassword },
    ]);

    console.log('✅ Users created');

    // Create ChatRooms
    const chatRooms = [];

    // Create a chat room for each pair of users
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const chatRoom = await ChatRoom.create({
          name: `${users[i].username}-${users[j].username}`,
          participants: [users[i]._id, users[j]._id],
        });
        chatRooms.push(chatRoom);
      }
    }

    // Create a chat room named "all" with all users as participants
    const allChatRoom = await ChatRoom.create({
      name: 'all',
      participants: users.map(user => user._id),
    });
    chatRooms.push(allChatRoom);

    console.log('✅ Chat rooms created');

    // Link last message to chat room
    chatRooms.forEach(async (chatRoom)=>{
      const lastMessage = await Message.findOne({ chatRoomId: chatRoom._id }).sort({ createdAt: -1 });
      chatRoom.lastMessage = lastMessage._id;
      await chatRoom.save();
    })

    console.log('✅ Chat room updated with last message');
    console.log('🎉 Sample data successfully inserted!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
    process.exit(1);
  }
};

seed();
