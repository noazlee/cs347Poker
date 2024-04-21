/*
BASE NODE FILE THAT IS EXECUTED BY THE BACKEND
*/
//test
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { connectDb } = require('./db');

// const pokerLogic = require('./routes/poker-logic.js');
const userLogic = require('./routes/user-logic.js');
const gameLogic = require('./routes/game-logic.js');
const registerSocketHandlers = require('./socketHandlers');

registerSocketHandlers(io);
app.use('/api',gameLogic(io));
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

