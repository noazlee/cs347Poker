const Round = require('./round');
const Player = require('./player');

const MAXNUMPLAYERS = 2;
const POTAMOUNT = 10000;
const GAMEMODE = 'regular';
const SMALLBLINDAMOUNT = 200;

class Game {
    constructor(ioInstance, hostId, hostSocketId) {
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
        

        this.addPlayer(hostId, hostSocketId, POTAMOUNT, false);
        this.addAiPlayers();
    }

    addPlayer(userId, socketId, Chips, isAI){
        if (this.players.some(p => p.userId === userId)) {
            console.log("Player already exists:", userId);
            return false; 
        }
        let newPlayer = new Player(userId, socketId, Chips,isAI);
        this.players.push(newPlayer);
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
        this.currentRound = new Round(this);
        this.currentRound.start();
        this.io.in(this.gameId).emit('game-started', {
            gameId: this.gameId,
            players: this.players.map(player => ({
                userId: player.userId,
                chips: player.chips
            })),
        });
    }

    startNewRound(){
        //TBI
    }
}

module.exports = Game;

