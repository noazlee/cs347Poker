const Round = require('./round');
const Player = require('./player');

const MAXNUMPLAYERS = 2;
const POTAMOUNT = 10000;
const GAMEMODE = 'regular';
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
        this.addAiPlayers();
    }

    addPlayer(userId, socketId, username, isAI){
        if (this.players.some(p => p.userId === userId)) {
            console.log("Player already exists:", userId);
            return false; 
        }
        let newPlayer = new Player(userId, socketId, username, POTAMOUNT,isAI);
        this.players.push(newPlayer);
    }

    removePlayer(playerId) {
        let playerIndex = undefined;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].userId === playerId) {
                playerIndex = i;
            }
        }
        
        if (playerIndex === undefined) {
            console.error(`tried to remove player ${playerId}, but could not find it in game`);
        } else {
            this.players.splice(playerIndex, 1);
            if (this.hostId === playerId) {
                this.hostId = this.players[0].userId;
            }
        }
    }

    addAiPlayers(){
        // to be implemented
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

