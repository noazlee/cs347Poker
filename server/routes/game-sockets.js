const Game = require('../classes/game-model');
const Player = require('../classes/player');

module.exports = function(io){
    const games = {}; // This will store all game instances

    io.on('connection', (socket) => {
        console.info('New client connected:', socket.id);
    
        // Create a new game
        socket.on('create-game', (data) => {
            const newGame = new Game(data.hostId, socket.id);
            games[newGame.gameId] = newGame;
            socket.join(newGame.gameId);
            console.info("Game created:", newGame.gameId);
            socket.emit('game-created', { gameId: newGame.gameId, hostId: data.hostId, players: newGame.players });
        });
    
        // Player joining a game
        socket.on('join-game', (data) => {
            const game = games[data.gameId];
            if (game && game.status === 'waiting') {
                const newPlayer = new Player(data.playerId, socket.id, 1000, false); // Example starting chips
                game.addPlayer(newPlayer);
                socket.join(data.gameId);

                console.info(`${data.playerId} joined game ${data.gameId}`);
                io.to(data.gameId).emit('player-joined', { playerId: data.playerId, gameId: data.gameId });
            } else {
                socket.emit('join-failed', { message: 'Game not found or not joinable' });
            }
        });
    
        // Player leaving a game
        socket.on('leave-game', (data) => {
            const game = games[data.gameId];
            if (game) {
                game.removePlayer(data.playerId);
                socket.leave(data.gameId);

                console.info(`${data.playerId} left game ${data.gameId}`);
                io.to(data.gameId).emit('player-left', { playerId: data.playerId, gameId: data.gameId });

                if (game.players.length === 0) {
                    delete games[data.gameId];
                    console.info(`Game ${data.gameId} ended as all players have left.`);
                }
            }
        });
    
        // Start the game
        socket.on('start-game', (data) => {
            const game = games[data.gameId];
            if (game) {
                game.startGame();  // NOT WORKING YET
                io.to(data.gameId).emit('game-started', { gameId: data.gameId });
            }
        });
    
        // Disconnecting
        socket.on('disconnect', () => {
            console.info('Client disconnected', socket.id);
        });
    });
}
