import io from "socket.io-client";
import Cookies from "js-cookie";
const socketEndpoint = "http://localhost:4000";
let socket;

const token = Cookies.get('token')
export function initializeSocket(user) {
  socket = io(socketEndpoint, {
    reconnection: true,
    query: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected");
    // Emit the setup event with the user data
    socket.emit("setup", user);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
    
  });
  
  return socket;
}

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};
