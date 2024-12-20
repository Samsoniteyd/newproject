import express from 'express';
import { protect } from '../middleware/auth';
import { ChatController } from '../controllers/chat.controller';

const router = express.Router();

export function setupChatRoutes(chatController: ChatController) {
  // Get user's conversations
  router.get('/conversations', protect, async (req, res) => {
    try {
      const conversations = await chatController.getConversations(req.user.id);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching conversations' });
    }
  });

  // Get messages for a conversation
  router.get('/conversations/:id/messages', protect, async (req, res) => {
    try {
      const messages = await chatController.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching messages' });
    }
  });

  // Create new conversation
  router.post('/conversations', protect, async (req, res) => {
    try {
      const { participantId } = req.body;
      const conversation = await chatController.createConversation([
        req.user.id,
        participantId,
      ]);
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: 'Error creating conversation' });
    }
  });

  // Mark messages as read
  router.post('/conversations/:id/read', protect, async (req, res) => {
    try {
      await Message.updateMany(
        {
          conversation: req.params.id,
          sender: { $ne: req.user.id },
          readBy: { $ne: req.user.id },
        },
        {
          $addToSet: { readBy: req.user.id },
        }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error marking messages as read' });
    }
  });

  return router;
} 