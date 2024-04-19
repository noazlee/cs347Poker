const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const pokerLogic = require('./routes/poker-logic.js');
const game = require('./routes/game.js');

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  // Implement poker game logic here
  
  socket.on('create-game', (data) => {
    // Add user to a game room, for example
    socket.join(data.gameId);
    // Notify others in the room
    // socket.to(data.gameId).emit('player-joined', { playerId: socket.id, gameId: data.gameId });
    console.log(`User ${socket.id} created a game`);
  });
  
  socket.on('join-game', (data) => {
    // Add user to a game room, for example
    socket.join(data.gameId);
    // Notify others in the room
    // socket.to(data.gameId).emit('player-joined', { playerId: socket.id, gameId: data.gameId });
    console.log(`User ${socket.id} joined a game`);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

app.use(pokerLogic);
app.use(game);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));