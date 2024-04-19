/*
THIS FILE WAS CREATED BY NOAH AND ITS PURPOSE IS TO HANDLE THE LOGIC OF GAME CREATION, 
PLAYERS JOINING, ETC. UP IN THE LOBBY UNTIL THE GAME STARTS.
*/

const router = require('express').Router();
const Game = require('../models/game-model');
const games = {}; //stores all games

module.exports = (io) => {

    //CREATE GAME LOGIC
    const createNewGame = hostId => {
        const newGame = new Game(hostId);
        games[newGame.gameId] = newGame;
        return newGame.gameId;
    }

    router.post('/create-game/:userId',(req, res) => {
        const {userId} = req.params;
        // Create a new game with a unique identifier
        const gameId = createNewGame(userId); // Logic to create a game -> NEEDS TO BE ADDED

        // Emit an event to all connected clients
        io.emit('game-created', { gameId: gameId });

        // Respond to the HTTP request
        res.status(200).json({ message: 'Game created', gameId: gameId, hostId:userId });
    });

    const joinGameRoom = (gameId, userId) => {
        // Check if the game exists and is in a 'waiting' status
        if (games[gameId] && games[gameId].status === 'waiting') {
            // Check if there is room to join the game or if an AI can be replaced
            const nonAiPlayers = games[gameId].players.filter(player => player.isAI==false).length;
            if (nonAiPlayers < games[gameId].maxPlayers) {
                games[gameId].addPlayer(userId);
                return { success: true };
            } else {
                // All slots are filled with real players, no room for new players
                return { success: false, message: 'Game is full, no AI players to replace' };
            }
        }
        
        // Game does not exist or is not in a joinable state
        return { success: false, message: 'Game not found or not joinable' };
    }


    // JOIN GAME LOGIC
    router.post('/join-game/:userId/:gameId',(req, res) => {
        const { userId,gameId } = req.params; 

        // Add the player to the game's room (your logic here)
        const result = joinGameRoom(gameId, userId); 

        if (result.success) {
            // Emit an event to all clients in the room
            io.to(gameId).emit('player-joined', { playerId: userId, gameId: gameId });

            // Respond to the HTTP request
            res.status(200).json({ message: 'Joined game', gameId: gameId });
        } else {
            // If the joining failed (game doesn't exist, etc.)
            res.status(400).json({ message: 'Error joining game' });
        }
    });

    // LEAVE GAME LOGIC
    router.post('/leave-game/:userId/:gameId', (req, res) => {
        const { userId, gameId } = req.params;
    
        if (games[gameId] && games[gameId].players.some(player => player.playerId === userId)) {
            games[gameId].removePlayer(userId);
    
            // Emit an event to all clients in the room
            io.to(gameId).emit('player-left', { playerId: userId, gameId: gameId });
    
            // Optionally, you might want to close the game room if no players are left
            if (games[gameId].players.length === 0) {
                delete games[gameId];  // Remove the game if empty
                io.emit('game-closed', { gameId: gameId });
            }
    
            res.status(200).json({ message: 'Left game', gameId: gameId });
        } else {
            res.status(404).json({ message: 'Game not found or player not in game' });
        }
    });

    router.get('/game-info',(req, res) => {
        res.status(200).json({games})
    });
    return router;
};