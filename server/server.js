const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // Allow GitHub Pages + all origins
    methods: ["GET", "POST"]
  }
});

// Serve static files from public folder (client.js, CSS, etc.)
app.use(express.static(join(__dirname, '../public')));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public', 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('chat message', (msg) => {
    console.log('Message:', msg);
    io.emit('chat message', msg);  // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Use Render's PORT or default to 3000 (locally)
const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
