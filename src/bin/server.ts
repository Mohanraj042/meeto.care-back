import { app } from '../app';
import { Server, Socket } from 'socket.io';
import * as http from 'http';
import { SERVER } from "../config"
 
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(SERVER.PORT || '3000');
app.instance.set('port', port);
 
/**
 * Create HTTP server.
 */
const server = http.createServer(app.instance);
 
// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
 
// Set up Socket.IO instance in app
app.instance.set('socketio', io);
const connectedUsers = [];
 
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
 
  socket.on('new-user-add', (newUserId) => {
    // Check if the user is not already added
    if (!connectedUsers.some((user) => user.userId === newUserId)) {
      connectedUsers.push({ userId: newUserId, socketId: socket.id, online: true });
      console.log('New User Connected', connectedUsers);
    }
 
    // Send the updated list of connected users to all clients
    io.emit('get-users', connectedUsers);
  });
 
  // Emit socketId back to the connected client
  io.to(socket.id).emit('socketId', socket.id);
 
  // Handle incoming messages
  socket.on('sendMessage', (data) => {
    console.log('Received message:', data.message);
 
    // Broadcast the new message to all clients
    io.emit('newMessage', data.message);
    console.log('newMessage', data.message);
  });
 
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
 
    // Remove the disconnected user from the connectedUsers array
    const disconnectedUserIndex = connectedUsers.findIndex((user) => user.socketId === socket.id);
    if (disconnectedUserIndex !== -1) {
      const disconnectedUserId = connectedUsers[disconnectedUserIndex].userId;
      connectedUsers.splice(disconnectedUserIndex, 1);
      console.log('User disconnected:', disconnectedUserId);
 
      // Send the updated list of connected users to all clients
      io.emit('get-users', connectedUsers);
    }
  });
});
 
// Start the server
app.init().then(() => {
  server.listen(port, '0.0.0.0');
});
 
server.on('error', onError);
server.on('listening', onListening);
server.setTimeout(3600 * 1000);
 
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: any) {
  const portNumber = parseInt(val, 10);
 
  if (isNaN(portNumber)) {
    // named pipe
    return val;
  }
 
  if (portNumber >= 0) {
    // port numbern
    return portNumber;
  }
 
  return false;
}
 
/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }
 
  const bind: any = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
 
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
 
/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening() {
  const addr = server.address() || '';
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.info('Listening on ' + bind);
}
