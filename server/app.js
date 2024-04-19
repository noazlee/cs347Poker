/*
BASE NODE FILE THAT IS EXECUTED BY THE BACKEND
*/

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// const pokerLogic = require('./routes/poker-logic.js');
const gameLogic = require('./routes/game-logic.js');
const registerSocketHandlers = require('./socketHandlers');

registerSocketHandlers(io);
app.use(gameLogic(io));
//app.use(pokerLogic); commented out because it is breaking the execution


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server and Socket.io listening on port ${PORT}`));
