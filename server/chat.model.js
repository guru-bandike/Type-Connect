import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userName: { type: String, required: [true, 'User name is required!'] },
  message: { type: String, required: [true, 'Message is required!'] },
  timestamp: { type: Date, required: [true, 'Timestamp is required!'] },
});

export const ChatModel = mongoose.model('chat', chatSchema);
