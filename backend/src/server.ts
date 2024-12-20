import express from 'express';
import http from 'http';
import { setupWebSocket } from './config/socket';
import { setupChatRoutes } from './routes/chat.routes';
import { ChatController } from './controllers/chat.controller';

const app = express();
const server = http.createServer(app);
const io = setupWebSocket(server);

// Initialize chat controller with socket.io instance
const chatController = new ChatController(io);

// Setup routes
app.use('/api/chat', setupChatRoutes(chatController));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 