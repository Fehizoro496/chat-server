require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');
const socketHandler = require('./sockets');
// const errorHandler = require('./middlewares/error.middleware');
const uploadRoute = require("./routes/upload.routes");
// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(uploadRoute);

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

// Error handler
// app.use(errorHandler);

// Test Route
app.get('/', (req, res) => {
  res.send('🔥 Chat API is running...');
});

// Create HTTP server & bind with socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket events
socketHandler(io);

// Start server
server.listen(PORT, () => {
  if (process.env.URL=='localhost') console.log(`🚀 Server listening on http://localhost:${PORT}`);
});