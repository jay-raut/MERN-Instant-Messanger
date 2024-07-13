import io from 'socket.io-client';

const socketEndpoint = "http://localhost:4000";
let socket;

export function initializeSocket(user) {
  socket = io(socketEndpoint, {
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    // Emit the setup event with the user data
    socket.emit('setup', user);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
}

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};
