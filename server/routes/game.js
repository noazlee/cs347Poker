const router = require('express').Router();

// Now the router takes io as a parameter
module.exports = (io) => {

    const createNewGame = () =>{
        return 5;
    }

    router.post('/create-game',(req, res) => {
        // Create a new game with a unique identifier
        const gameId = createNewGame(); // Logic to create a game -> NEEDS TO BE ADDED

        // Emit an event to all connected clients
        io.emit('game-created', { gameId: gameId });

        // Respond to the HTTP request
        res.status(200).json({ message: 'Game created', gameId: gameId });
    });

    router.post('/join-game',(req, res) => {
        const { gameId } = req.body; // Assume the gameId is passed in the request body

        // Add the player to the game's room (your logic here)
        const result = joinGameRoom(gameId, req.user.id); // Example function to handle game joining logic

        if (result.success) {
            // Emit an event to all clients in the room
            io.to(gameId).emit('player-joined', { playerId: req.user.id, gameId: gameId });

            // Respond to the HTTP request
            res.status(200).json({ message: 'Joined game', gameId: gameId });
        } else {
            // If the joining failed (game doesn't exist, etc.)
            res.status(400).json({ message: 'Error joining game' });
        }
    });
    return router;
};