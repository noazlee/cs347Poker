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
}

class Round {
    constructor(game) {
        this.game = game;
        this.players = game.players;  // Direct reference to the game's players
        this.deck = new Deck();
        this.smallBlindAmount = game.smallBlindAmount;
        this.currentBet = this.smallBlindAmount * 2;
        this.pot = 0;
        this.hands = [];
        this.stage = 0;
        this.startingPlayer = 0;
        this.currentPlayer = 0;
    }

    start() {
        this.players.forEach(player => {
            if (player.isPlaying) {
                player.resetForNewRound();
            }
        });

        this.deck.shuffle();
        this.players.filter(player => player.isInRound).forEach(player => {
            player.addCardToHand(this.deck.dealOneCard());
            player.addCardToHand(this.deck.dealOneCard());
        });

        this.pot = 0;
        this.setupBettingOrder();
        this.advanceToNextPlayer();
    }

    setupBettingOrder() {
        if (this.game.rounds.length === 0) {  // First round
            this.startingPlayer = (this.game.currentSmallBlind + 2) % this.players.length;  // Player after big blind starts
            this.currentPlayer = this.startingPlayer;
        } else {
            this.startingPlayer = (this.game.currentSmallBlind + 1) % this.players.length;  // Small blind starts the subsequent rounds
            this.currentPlayer = this.startingPlayer;
        }
    }

    advanceToNextPlayer() {
        do {
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        } while (!this.players[this.currentPlayer].isInRound);

        this.notifyCurrentPlayer();
    }

    notifyCurrentPlayer() {
        this.game.notifyPlayerToAct(this.players[this.currentPlayer].userId);
    }
}
