const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const pokerLogic = require('./routes/poker-logic.js');
const game = require('./routes/game.js');
const registerSocketHandlers = require('./socketHandlers');

registerSocketHandlers(io);
app.use('/api', game(io));
app.use(pokerLogic);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server and Socket.io listening on port ${PORT}`));
