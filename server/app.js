/*
BASE NODE FILE THAT IS EXECUTED BY THE BACKEND
*/
//app.js
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const acceptedURL  = ['http://10.133.26.36:3001', 'http://localhost:3001']
const io = socketIo(server,{
    cors: {
        origin: acceptedURL, 
        methods: ["GET", "POST"],
        credentials:true
    },
    transports:['websocket','polling']
});

app.use(cors({
    origin: acceptedURL 
  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { connectDb } = require('./db');

// const pokerLogic = require('./routes/poker-logic.js');
const userLogic = require('./routes/user-logic.js');
const gameSockets = require('./routes/game-sockets.js');
// const registerSocketHandlers = require('./socketHandlers');

// registerSocketHandlers(io);
gameSockets(io);
app.use('/api',userLogic);
//app.use(pokerLogic); commented out because it is breaking the execution

const port = process.env.PORT || 3000;
connectDb().then(() => {
    server.listen(port, () => {
        console.log(`Server and socket.io running on port ${port}`);
    });
}).catch(err => {
    console.error('Database connection failed', err);
    process.exit();
});

