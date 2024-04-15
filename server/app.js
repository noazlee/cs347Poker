const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const pokerLogic = require('./routes/poker-logic.js');

// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);
//   // Implement poker game logic here
//   socket.on('disconnect', () => console.log('Client disconnected'));
// });

app.use(pokerLogic);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));