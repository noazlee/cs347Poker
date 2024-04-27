// round.js
class Round {
    constructor() {
        this.game = game;
        this.players = game.players;  
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
        this.setBettingOrder();
        this.advanceToNextPlayer(); 
    }

    setBettingOrder() {
        if (this.game.rounds.length === 0) {  // If it's the first round
            // start with the player after the big blind
            this.startingPlayer = (this.game.currentSmallBlind + 2) % this.players.length; 
            this.currentPlayer = this.startingPlayer;
        } else {
            // normally, start with the small blind
            this.startingPlayer = (this.game.currentSmallBlind + 1) % this.players.length; 
            this.currentPlayer = this.startingPlayer;
        }
    }

    advanceToNextPlayer() {
        do {
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        } while (!this.players[this.currentPlayer].isInRound);  

        this.game.notifyPlayerToAct(this.players[this.currentPlayer].userId);
    }

    notifyPlayerToAct(playerId) {
        this.game.io.to(playerId).emit('your-turn', {
            playerId: playerId,
        });
    }
    

}
