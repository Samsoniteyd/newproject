import { Server } from 'socket.io';
import { Message } from '../models/Message';
import { Conversation } from '../models/Conversation';
import { User } from '../models/User';

export class ChatController {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      // Join user's personal room
      socket.on('join', async (userId: string) => {
        socket.join(userId);
        await User.findByIdAndUpdate(userId, { isOnline: true });
      });

      // Handle new messages
      socket.on('message', async (data: {
        conversationId: string;
        senderId: string;
        content: string;
      }) => {
        try {
          const message = await Message.create({
            conversation: data.conversationId,
            sender: data.senderId,
            content: data.content,
          });

          const populatedMessage = await message.populate('sender', 'name avatar');

          // Update conversation's last message
          await Conversation.findByIdAndUpdate(data.conversationId, {
            lastMessage: message._id,
          });

          // Emit message to all participants
          const conversation = await Conversation.findById(data.conversationId)
            .populate('participants', '_id');

          if (conversation) {
            conversation.participants.forEach((participant) => {
              this.io.to(participant._id.toString()).emit('message', populatedMessage);
            });
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });

      // Handle typing indicators
      socket.on('typing', (data: { conversationId: string; userId: string }) => {
        socket.to(data.conversationId).emit('typing', data.userId);
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        const userId = socket.handshake.auth.userId;
        if (userId) {
          await User.findByIdAndUpdate(userId, { isOnline: false });
        }
      });
    });
  }

  async getConversations(userId: string) {
    return await Conversation.find({ participants: userId })
      .populate('participants', 'name avatar')
      .populate('lastMessage')
      .sort('-updatedAt');
  }

  async getMessages(conversationId: string) {
    return await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort('createdAt');
  }

  async createConversation(participants: string[]) {
    return await Conversation.create({
      participants,
    });
  }
} 