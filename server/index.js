// server.js

const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);

const cors = require('cors')
app.use(cors());

const io = new Server(server,{
    cors: {
        origin: "*",
    }
});

let players = {
  p1: { name: "Praveen", health: 100 },
  p2: { name: "Sammy", health: 100 }
};

const connectedUsers = new Set();

io.on('connection', (socket) => {
  if (connectedUsers.has(socket.id)) {
    console.log('User already connected', socket.id);
    return;
  }

  console.log('A user connected ', socket.id);
  connectedUsers.add(socket.id);

  socket.on('p1Attack', () => {
    players.p2.health -= Math.floor(Math.random() * (20 - 10 + 1) + 10);
    io.emit('updateGameState', players);
  });

  socket.on('p1Heal', () => {
    players.p1.health += Math.floor(Math.random() * (20 - 10 + 1) + 10);
    io.emit('updateGameState', players);
  });

  socket.on('p2Attack', () => {
    players.p1.health -= Math.floor(Math.random() * (20 - 10 + 1) + 10);
    io.emit('updateGameState', players);
  });

  socket.on('p2Heal', () => {
    players.p2.health += Math.floor(Math.random() * (20 - 10 + 1) + 10);
    io.emit('updateGameState', players);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected ', socket.id);
    connectedUsers.delete(socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
