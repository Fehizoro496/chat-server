const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log(req.body);
    

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const allUsers = await User.find();
    const newUser = await User.create({ username, email, password: hashedPassword });
    for (let i=0; i < allUsers.length; i++) {
            ChatRoom.create({
              name: `${newUser.username}-${allUsers[i].username}`,
              participants: [newUser._id, allUsers[i]._id],
            });
          }
    await ChatRoom.findOneAndUpdate(
      { name: 'all' },
      { $push: { participants: newUser._id } }
    );

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
