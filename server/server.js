import { config } from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import app from './app.js';
import { connectToMongoDbAtlas } from './config/db.js';
import chatSocket from './chat.socket.js';

// Loading environment variables
config();

// Create http server using express instance
const server = http.createServer(app);

// Create socket server
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

// Handle socket events
chatSocket(io);

// Connect to DB
await connectToMongoDbAtlas();

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is listening on ${port}.`);
});
