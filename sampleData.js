require('dotenv').config();
const mongoose = require('mongoose');
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
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      { username: 'Alice', email: 'alice@example.com', password: hashedPassword },
      { username: 'Bob', email: 'bob@example.com', password: hashedPassword },
      { username: 'Charlie', email: 'charlie@example.com', password: hashedPassword },
    ]);

    console.log('✅ Users created');

    // Create Chat Room (Alice & Bob)
    const chatRoom = await ChatRoom.create({
      participants: [users[0]._id, users[1]._id],
      isGroupChat: false,
    });

    console.log('✅ Chat room created');

    // Create Messages
    await Message.insertMany([
      {
        chatRoomId: chatRoom._id,
        senderId: users[0]._id,
        message: 'Hey Bob!',
        messageType: 'text',
      },
      {
        chatRoomId: chatRoom._id,
        senderId: users[1]._id,
        message: 'Hey Alice, how are you?',
        messageType: 'text',
      },
    ]);

    console.log('✅ Messages inserted');

    // Link last message to chat room
    const lastMessage = await Message.findOne({ chatRoomId: chatRoom._id }).sort({ createdAt: -1 });
    chatRoom.lastMessage = lastMessage._id;
    await chatRoom.save();

    console.log('✅ Chat room updated with last message');
    console.log('🎉 Sample data successfully inserted!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
    process.exit(1);
  }
};

seed();
