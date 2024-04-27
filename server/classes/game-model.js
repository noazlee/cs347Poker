class Game {
    constructor(ioInstance, hostId, hostSocketId) {
        this.io = ioInstance;
        this.gameId = Math.random().toString(36).substring(2, 15);
        this.players = [];
        this.maxPlayers = MAXNUMPLAYERS;
        this.hostId = hostId;
        this.hostSocketId = hostSocketId;
        this.potAmount = POTAMOUNT;
        this.gameMode = GAMEMODE;
        this.smallBlindAmount = SMALLBLINDAMOUNT;
        this.rounds = [];
        this.status = 'waiting';
        this.currentSmallBlind = 0;  // Index of the small blind in the players array

        this.addPlayer(hostId, hostSocketId, false);
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

