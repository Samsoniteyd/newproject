const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    
    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [req.user._id, receiverId] }
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    const chat = await Chat.create({
      participants: [req.user._id, receiverId]
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    
    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
      .populate('participants', 'fullName')
      .populate('lastMessage');

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 