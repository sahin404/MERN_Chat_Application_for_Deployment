import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

//map for storing online Users
const usersSocketMap = {};

// return data socketid to message controller
export const getUserSocketId = (userId)=>{
  return usersSocketMap[userId];
}

//socket server
io.on("connection", (socket) => {
  console.log("Socket connected with user: ", socket.id);

  const userId = socket.handshake.query.id;
  
  if (userId) {
    usersSocketMap[userId] = socket.id;
  }

  io.emit("onlineUsers", Object.keys(usersSocketMap));

  socket.on("disconnect", () => {
    console.log("Socket disconnected user: ", socket.id);
    delete usersSocketMap[userId];
    io.emit("onlineUsers", Object.keys(usersSocketMap))
  });


});

export { app, io, server };
