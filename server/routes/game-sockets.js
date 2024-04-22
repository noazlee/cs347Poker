//game-sockets.js
const Game = require('../classes/game-model');
module.exports = function(io){
    const games = {};
    const router = require('express').Router();
    io.on('connection', (socket) => {
        console.info('New client connected:', socket.id);
    
        // Create a new game
        socket.on('create-game', (data) => {
            const newGame = new Game(data.hostId);
            games[newGame.gameId] = newGame;
            socket.join(newGame.gameId);
            console.info("THIS WORKED!");
            socket.emit('game-created', { gameId: newGame.gameId, hostId: data.hostId });
        });
    
        // Player joining a game
        socket.on('join-game', (data) => {
            // Logic for joining the game, similar to joinGameRoom function
            const result = joinGameRoom(data.gameId, data.playerId);
            // Handle the result accordingly and emit events
        });
    
        // Player leaving a game
        socket.on('leave-game', (data) => {
            // Similar logic as in the /leave-game/:userId/:gameId route
            // Emit events for leaving the game
        });
    
        // Start the game
        socket.on('start-game', (data) => {
            // Logic for starting the game
            // Emit events for game start
        });
    
        // Additional game logic...
    
        // Disconnecting
        socket.on('disconnect', () => {
            // Handle player disconnection, if necessary
        });
        return router;
    });
}

