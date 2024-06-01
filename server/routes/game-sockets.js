const Game = require('../classes/game-model');
const Player = require('../classes/player');
const { connectDb } = require('../db');

module.exports = function(io){
    const games = {}; // This will store all game instances

    async function addGame(date, gameId, players, chipsWon, winner, rounds) {
        const db = await connectDb();

        rounds.forEach(round=>{
            round.io = null;
        })

        console.log(rounds);

        const newGame = {
            date:date,
            gameId: gameId,
            players: players,
            chipsWon: chipsWon,
            winner: winner,
            rounds: rounds
        };
        
        console.log('trying to access db');
        
        await db.collection('games').insertOne(newGame);
        return newGame;
    }

    async function updatePlayerWinTotal(players, winner){ 
        const db = await connectDb();
        const users = db.collection('users');

        for (const player of players) {
            try{
                const user = await users.findOne({ userId: player.userId });
                console.log(player, 'player');
                console.log(winner),'winner';
                if (player.userId === winner.userId) {
                    const currentWinTotal = parseInt(user.gamesWon);
                    console.log(user);
                    const updatedWins = currentWinTotal + 1;
                    
                    await users.updateOne(
                        { userId: player.userId },
                        {
                            $set: { gamesWon: updatedWins },
                            $currentDate: { lastUpdated: true }
                        }
                    );

                    console.log(`Updated wins for player ${player.userId}: ${updatedWins}`);
                } else {
                    console.log(`User not found for player ${player.userId}`);
                }
            }catch (error) {
                console.error(`Failed to update chips for player ${player.userId}:`, error);
            }
        };
    }



    io.on('connection', (socket) => {
        console.info('New client connected:', socket.id);
    
        // Create a new game
        socket.on('create-game', (data) => {
            const newGame = new Game(io, data.hostId, data.username, socket.id);
            games[newGame.gameId] = newGame;
            socket.join(newGame.gameId);
            console.info("Game created:", newGame.gameId);
            socket.emit('game-created', { gameId: newGame.gameId, hostId: data.hostId,  players: newGame.players.map(p => p.userId)  });
        });
    
        // Player joining a game
        socket.on('join-game', (data) => {
            const game = games[data.gameId];
            if (game && game.status === 'waiting') {
                game.addPlayer(data.playerId, socket.id, data.username, false);
                socket.join(data.gameId);

                //checking socket room
                // if (io.sockets.adapter.rooms.has(data.gameId)) {
                //     const room = io.sockets.adapter.rooms.get(data.gameId);
                //     console.log(`Sockets in room ${data.gameId}:`);
                //     room.forEach((value, socketId) => {
                //         console.log(socketId);
                //     });
                // } else {
                //     console.log(`No active room with ID: ${data.gameId}`);
                // }

                io.to(data.gameId).emit('update-players', { players: game.players.map(player => ({userId: player.userId, username: player.username})) });
                io.to(data.gameId).emit('player-joined', { 
                    player_names: game.players.map(p => p.userId),
                    playerId: data.playerId,
                    gameId: data.gameId,
                    hostId: game.hostId
                });
            } else {
                console.log('Game not found or not joinable')
            }
        });

        socket.on('add-ai', (data) => {
            const game = games[data.gameId];
            if (game && game.status === 'waiting') {
                game.addAiPlayer();
                io.to(data.gameId).emit('update-players', { players: game.players.map(player => ({userId: player.userId, username: player.username})) });
            } else {
                console.log('Game not found or not joinable');
            }
        });

        socket.on('remove-ai', (data) => {
            const game = games[data.gameId];
            if (game) {
                game.removeAiPlayer(data.playerId);


                if (game.isActive === false) {
                    delete games[data.gameId];
                    console.info(`Game ${data.gameId} ended as all players have left.`);
                } else {
                    console.info(`${data.playerId} left game ${data.gameId}`);
                    io.to(data.gameId).emit('player-left', { playerId: data.playerId, gameId: data.gameId, newHostId: game.hostId, players: game.players });
                }
            }
        });

        // Player move during round of betting
        socket.on('player-action', (data) => {
            const game = games[data.gameId];
            console.log('Action received', data.action, data.gameId);
            if (game) {
                io.to(data.gameId).emit('player-action', { username: data.username, action: data.action });
                const round = game.currentRound;
                if (round) {
                    round.handlePlayerAction(socket, data);
                }
            }
        });

        socket.on('round-end-client', (data) => {
            const game = games[data.gameId];
            console.log('Round ended');

            if(data.stillPlaying===true){
                if (game) {
                    let curRound = game.rounds[game.rounds.length-1];
                    if(curRound.roundPlaying===true){ // prevents calling twice
                        console.log('starting new round');
                        game.startNewRound(data.prevIndex);
                    }
                }
            }else{
                if(game){
                    console.log('adding new game');
                    const newGame = addGame(game.date, game.gameId, game.players, data.winner.chips , data.winner, game.rounds); // gameId, players, chipsWon, winner, rounds
                    game.updatePlayerChips();
                    updatePlayerWinTotal(game.players, data.winner[0]);
                    console.log('game added');
                    console.log(newGame);
                    games[data.gameId]=null;
                    // send socket emit that sends people to home screen.
                }
            }
        });
    
        // Player leaving a game
        socket.on('leave-game', (data) => {
            const game = games[data.gameId];
            if (game) {
                game.removePlayer(data.playerId);
                socket.leave(data.gameId);

                if (game.isActive === false) {
                    delete games[data.gameId];
                    console.info(`Game ${data.gameId} ended as all players have left.`);
                } else {
                    console.info(`${data.playerId} left game ${data.gameId}`);
                    io.to(data.gameId).emit('player-left', { playerId: data.playerId, gameId: data.gameId, newHostId: game.hostId, players: game.players });
                }
            }
        });

        socket.on('leave-mid-game', (data) => {
            const game = games[data.gameId];
            if (game) {
                socket.leave(data.gameId);
                game.removePlayerMidGame(data.userId, true)
            }

            if (game.isActive === false) {
                delete games[data.gameId];
                console.info(`Game ${data.gameId} ended as all players have left.`);
            } else {
                console.info(`${data.playerId} left game ${data.gameId}`);
            }
        });

        socket.on('leave-socket', (data) => {
            const game = games[data.gameId];
            if (game) {
                socket.leave(data.gameId);
            }
        });
        
    
        // Start the game
        socket.on('start-game', (data) => {
            const game = games[data.gameId];
            if (game) { //changing this to check host causes the game to BREAK - binary error
                game.maxPlayers = parseInt(data.settings.maxPlayers);
                game.startingChips = parseInt(data.settings.startingChips);
                game.players.forEach(player => {
                    player.chips = parseInt(data.settings.startingChips);
                });
                game.smallBlindAmount = parseInt(data.settings.blindAmount);
                game.startGame();
                console.info(`Game has started ${game.gameId}`);
                // io.to(data.gameId).emit('game-started', {});
            }
        });
    
        // Disconnecting
        socket.on('disconnect', () => {
            console.info('Client disconnected', socket.id);
        });

        socket.on('check', (data) => {
            console.log('check');
        });

        socket.on('fold', (data) => {
            console.log('fold');
        });

        socket.on('raise', (data) => {
            console.log('raise', data.amount);
        });
    });
}
