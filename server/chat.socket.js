import ChatRepository from './chat.repository.js';

let activeUsers = [];

const chatRepo = new ChatRepository();

const chatSocket = (io) => {
  // Handle connection event
  io.on('connect', (socket) => {
    // Handle join event
    socket.on('join', async (userName) => {
      // Attach user info to the specific socket
      socket.userName = userName;

      // Push to acitve users
      activeUsers.push(userName);

      // Welcome user
      socket.emit('welcome', userName);

      // Inform current active user to the room members
      io.emit('activeUsers', activeUsers);

      // Infrom other user that current user has hoined the room/chat
      socket.broadcast.emit('userJoined', userName);

      // Serve previous messages
      socket.emit('previousMessages', await chatRepo.getAll());
    });

    // Handle  message event
    socket.on('sendMessage', async ({ userName, message, timestamp }) => {
      const newMessage = await chatRepo.add(userName, message, timestamp);
      io.emit('broadcast_message', newMessage);
    });

    // Handle typing event
    socket.on('typing', (userName) => {
      socket.broadcast.emit('notifyTyping', userName);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
      activeUsers = activeUsers.filter((user) => user !== socket.userName);
      io.emit('activeUsers', activeUsers);
    });
  });
};

export default chatSocket;
