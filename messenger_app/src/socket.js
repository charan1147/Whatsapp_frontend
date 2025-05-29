import { io } from "socket.io-client";

const SOCKET_URL = "https://whatsapp-backend-15.onrender.com"; 
const socket = io(SOCKET_URL, { withCredentials: true });

socket.on("connect", () => {
  console.log("Connected to socket:", socket.id);
});

export const registerSocketUser = (userId) => {
  socket.emit("register", userId);
};

export default socket;