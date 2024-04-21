/*
THIS FILE WAS CREATED BY NOAH AND ITS PURPOSE IS TO HANDLE THE LOGIC OF GAME CREATION, 
PLAYERS JOINING, ETC. UP IN THE LOBBY UNTIL THE GAME STARTS.
*/

const router = require('express').Router();
const Game = require('../classes/game-model');
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
        io.on("connection", async (socket) => {
            const userId = await computeUserIdFromHeaders(socket);
          
            socket.join(userId);
            console.info("connection achieved");
          
            // and then later
            io.to(userId).emit("hi");
          });

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
            const isHostLeaving = userId === games[gameId].hostId;
            games[gameId].removePlayer(userId);
    
            // Emit an event to all clients in the room
            io.to(gameId).emit('player-left', { playerId: userId, gameId: gameId });
    
            if (isHostLeaving) {
                // Find a new human host (not an AI player)
                const newHost = games[gameId].players.find(player => !player.isAI);
    
                if (newHost) {
                    // Assign new host
                    games[gameId].hostId = newHost.playerId;
                    io.to(gameId).emit('new-host', { newHostId: newHost.playerId, gameId: gameId });
                } else {
                    // No human players left, delete the game
                    delete games[gameId];
                    io.emit('game-closed', { gameId: gameId });
                    res.status(200).json({ message: 'Game closed as the last human player left', gameId: gameId });
                    return;
                }
            }
    
            res.status(200).json({ message: 'Left game', gameId: gameId });
        } else {
            res.status(404).json({ message: 'Game not found or player not in game' });
        }
    });

    router.post('/start-game/:gameId', (req, res) => {
        const { gameId } = req.params;
        
    });

    // HELPFUL ROUTES FOR TESTING - CHECK ALL GAMES AND INDIVIDUAL GAME DATA
    router.get('/game-info',(req, res) => {
        res.status(200).json({games})
    });
    router.get('/game-info/:gameId',(req, res) => {
        const {gameId} = req.params;
        if(games[gameId]){
            res.status(200).json({game: games[gameId]});
        }else{
            res.status(404).json({message: "Game not found"});
        }  
    });
    return router;
};