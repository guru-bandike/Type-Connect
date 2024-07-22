import { ChatModel } from './chat.model.js';

export default class ChatRepository {
  async add(userName, message) {
    try {
      return await ChatModel.create({ userName, message, timestamp: new Date() });
    } catch (err) {
      throw err;
    }
  }

  async getAll() {
    try {
      return await ChatModel.find({});
    } catch (err) {
      throw err;
    }
  }
}
