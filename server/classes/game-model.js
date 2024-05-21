const Round = require('./round');
const Player = require('./player');

const MAXNUMPLAYERS = 2;
const POTAMOUNT = 10000;
const GAMEMODE = "Texas Hold 'Em";
const SMALLBLINDAMOUNT = 200;

class Game {
    constructor(ioInstance, hostId, username, hostSocketId) {
        this.io = ioInstance;
        this.gameId = Math.random().toString(36).substring(2, 15);
        this.players = [];
        this.maxPlayers = MAXNUMPLAYERS;
        this.hostId = hostId;
        this.hostSocketId = hostSocketId;
        this.startingChips = POTAMOUNT;
        this.gameMode = GAMEMODE;
        this.smallBlindAmount = SMALLBLINDAMOUNT;
        this.rounds = [];
        this.status = 'waiting';
        

        this.addPlayer(hostId, hostSocketId, username, false);
    }

    addPlayer(userId, socketId, username, isAI){
        if (this.players.some(p => p.userId === userId)) {
            console.log("Player already exists:", userId);
            return false; 
        }

        let newPlayer;
        if (!isAI) {
            newPlayer = new Player(userId, socketId, username, this.startingChips, isAI);
        } else {
            // newPlayer = new AI
            // Call method to add AI socket to gameId
        }
        this.players.push(newPlayer);
    }

    removePlayer(playerId, isAi) {
        let playerIndex = undefined;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].userId === playerId) {
                playerIndex = i;
            }
        }
        
        if (playerIndex === undefined) {
            console.error(`tried to remove player ${playerId}, but could not find it in game`);
        } else {
            let playerToRemove = this.players.splice(playerIndex, 1);
            // If AI, call method to remove AI socket from gameId (reference AI object using playerToRemove[0])
            if (this.hostId === playerId) {
                let newHostIndex = 0;
                while (this.players[newHostIndex].isAi === true) {
                    newHostIndex++;
                }
                this.hostId = this.players[newHostIndex].userId;
            }
        }
    }

    addAiPlayer() {
        console.log("Add AI");
        this.addPlayer(undefined, undefined, undefined, true)
        // To be implemented: Add an AI player to the list of players
    }

    removeAiPlayer(playerId) {
        console.log("Remove AI");
        this.removePlayer(playerId, true);
        // To be implemented: Remove an AI player from the list of players
    }

    startGame() {
        if (this.players.length < 2) { 
            console.log("Not enough players to start the game.");
            return;
        }
        this.status = 'active';

        this.io.to(this.gameId).emit('game-started', {
            gameId: this.gameId,
            players: this.players.map(player => ({
                username: player.username,
                userId: player.userId,
                chips: player.chips
            })),
        });
        
        this.currentRound = new Round(this.io, this.gameId, 0, this.players, this.smallBlindAmount);
        this.rounds.push(this.currentRound);
        this.currentRound.start();
    }

    startNewRound(prevIndex){
        this.currentRound = new Round(this.io, this.gameId, prevIndex, this.players, this.smallBlindAmount);
        this.currentRound.start();
    }
}

module.exports = Game;

