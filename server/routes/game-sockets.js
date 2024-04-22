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
            
        });
    
        // Player leaving a game
        socket.on('leave-game', (data) => {
            
        });
    
        // Start the game
        socket.on('start-game', (data) => {
            // Logic for starting the game
            // Emit events for game start
        });

    
        // Disconnecting
        socket.on('disconnect', () => {
            // Handle player disconnection
        });
        return router;
    });
}

