import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketServer } from 'socket.io';
import { createRoutes } from './routes';
import AgrosoftBot from './bot/AgrosoftBot';
import path from 'path';

// Create Express app
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize bot
const bot = new AgrosoftBot();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', createRoutes(bot));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

// Socket.io events for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  socket.emit('status_update', {
    status: bot.getStatus(),
    isActive: bot.isActive(),
    stats: bot.getStats()
  });
  
  if (bot.getQRCode()) {
    socket.emit('qr_code', bot.getQRCode());
  }
  
  socket.emit('contacts_update', bot.getAuthorizedContacts());
  
  // Handle client events
  socket.on('add_contact', (phoneNumber) => {
    bot.authorizeContact(phoneNumber);
  });
  
  socket.on('remove_contact', (phoneNumber) => {
    bot.removeAuthorizedContact(phoneNumber);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Forward bot events to connected clients
bot.on('qr', (qrCode) => {
  io.emit('qr_code', qrCode);
});

bot.on('ready', () => {
  io.emit('status_update', {
    status: 'connected',
    isActive: true,
    stats: bot.getStats()
  });
});

bot.on('authenticated', () => {
  io.emit('status_update', {
    status: 'authenticated',
    isActive: true,
    stats: bot.getStats()
  });
});

bot.on('auth_failure', (error) => {
  io.emit('status_update', {
    status: 'auth_failed',
    isActive: false,
    error
  });
});

bot.on('disconnected', (reason) => {
  io.emit('status_update', {
    status: 'disconnected',
    isActive: false,
    reason
  });
});

bot.on('message_received', (message) => {
  io.emit('new_message', {
    type: 'received',
    ...message
  });
});

bot.on('message_sent', (message) => {
  io.emit('new_message', {
    type: 'sent',
    ...message
  });
});

bot.on('contact_authorized', () => {
  io.emit('contacts_update', bot.getAuthorizedContacts());
});

bot.on('contact_removed', () => {
  io.emit('contacts_update', bot.getAuthorizedContacts());
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});